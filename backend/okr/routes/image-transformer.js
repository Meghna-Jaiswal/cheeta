const express = require("express");
const router = express.Router();
var Image = require(__dirname + "/../models/Image");


const url = require('url');

var request = require('request');
var fs = require('fs');

const sharp = require('sharp');

async function updateToDB(req, imageUrl, operationParams, timeTaken) {

    try {
        let calledUrl = Buffer.from(req.app.baseUrl + req.originalUrl).toString('base64');
        let newImageObj = await Image.findOne({calledUrl:calledUrl});
        if(newImageObj){
            await Image.findByIdAndUpdate(newImageObj._id,{$set:{count:newImageObj.count+1}})
        }
        else{
            let data = {
                appId: req.params.appId,
                status: 1,
                sourceUrl: imageUrl,
                calledUrl: calledUrl,
                fileType: "img",
                count:1,
                timeTake: timeTaken,
               // accessIp: userAccessIp, // timetaken in resize/compress image
                others: {
                    img: req.app.baseUrl + req.originalUrl,
                    count: 1,
                    enhance: operationParams['enhance'],
                    format: operationParams['format'],
                    quality: operationParams['quality1'],
                    width: operationParams['width1'],
                    height: operationParams['height1'],
                    progressive: operationParams['progressive'],
                }
            }
    
            newImgObj = await Image.create(data);
        }
        

        // await req.app.redisClient.setAsync(req.originalUrl, JSON.stringify(newImgObj.others.img));
        // await req.app.redisClient.expire(req.originalUrl, 3600 * 24);
    } catch (err) {
        console.log("catch err image of update to db : ", err);
    }

}

const getImageUrl = function (baseHost, inputUrl) {
    if (baseHost == '') {
        let imageUrl = url.parse(inputUrl, true);
        return url.format(imageUrl);
    } else {
        let imageUrl = url.parse(inputUrl);
        imageUrl.host = baseHost.replace('https://', '').replace('http://', '')
        imageUrl.protocol = baseHost.startsWith('https') ? 'https' : 'http'
        console.log("url.format(imageUrl) :: ", url.format(imageUrl), imageUrl);
        return url.format(imageUrl)
    }
}

async function validateIPCall(req) {
    console.log("req user ip : ", req.headers['x-forwarded-for']);
    // let userIp = req.headers['x-forwarded-for'];

    var userIp = await requestIp.getClientIp(req);
    userAccessIp = userIp;
    console.log('ip for', userIp);

    return true;
    if (req.params.appId != 'mogiio-enhance') return true;

    var whiteListIPs = ["119.82.70.204", "13.126.115.53", "180.151.239.227", "13.127.47.207", "13.233.163.247", "13.126.115.53"];
    console.log("whiteListIPs.indexOf(userIp) ::: ", whiteListIPs.indexOf(userIp));
    if (whiteListIPs.indexOf(userIp) !== -1) { return true; }

    let redisImgAccess = await req.app.redisClient.getAsync(userIp + "_Image_TR");
    console.log("clientIp : ", userIp, redisImgAccess);
    if (redisImgAccess) {
        redisImgAccess = JSON.parse(redisImgAccess);

        if (redisImgAccess.count > 20)
            return false;
        else {
            var newUrls;
            (newUrls = redisImgAccess.urls).push(req.originalUrl);
            var count = redisImgAccess.count;
            // count = count++;
            console.log("redisImgAccess.count : ", redisImgAccess.count, typeof redisImgAccess.count, count++);
            // don't remove above count++ console

            await req.app.redisClient.del(userIp + "_Image_TR");
            await req.app.redisClient.setAsync(userIp + "_Image_TR", JSON.stringify({ count: count, urls: newUrls }));
            await req.app.redisClient.expire(userIp + "_Image_TR", 3600 * 24);
            return true;
        }
    } else {
        await req.app.redisClient.setAsync(userIp + "_Image_TR", JSON.stringify({ count: 1, urls: [req.originalUrl] }));
        await req.app.redisClient.expire(userIp + "_Image_TR", 3600 * 24);
        return true;
    }
}
// as query parameter cloudinary
router.get(['/resize/:appId/image/:type/:trData/:imageUrl', '/resize/:appId/image/:type/:trData/:imageUrl/*'], async function (req, res, next) {

    // req.query = decodeURIComponent(req.query);
    var operationParams = {};
//    var validIp = await validateIPCall(req);

    //console.log("validIp resp :", validIp);
    if (!validIp)
        return res.status(404).json({ status: "unauth", message: "Invalid call, Your daily access limit has been exceeded.Contact Mogi I/O support. Or Register at https://tech.mogiapp.com " });

    //console.log("in cloudinary - req.url ::: inside url parameter : ", req.params, req.originalUrl);
    let urlStr = req.originalUrl.split(req.params.trData);
    //console.log("urlStr :: ", urlStr);
    req.params.imageUrl = urlStr[1];
    //console.log("req.params.imageUrl :: ", req.params.imageUrl, req.params.appId);
    if (!req.params.imageUrl || (!req.params.appId && !req.params.imageUrl)) {
        console.log("image not found");
        return res.sendStatus(403);
    }

    let trData = req.params.trData.split(',');

    // let width1, height1, enhance, format, quality1, progressive, crop1, gravity1;

    for (var i = 0; i < trData.length; i++) {

        if (trData[i].substring(0, 3) == "tr:") {
            trData[i] = trData[i].substr(3);
        }
        //console.log(trData[i], trData[i].substring(0, 1))

        switch (trData[i].substring(0, 1)) {
            case 'o':
                let oprs = trData[i].substr(1);
                oprs = oprs.split("-");
                oprs.forEach(element => {
                    if (isNaN(element)) {
                        operationParams[element] = true;
                    }
                    else {
                        operationParams.rotateAngle = element;
                    }
                });
                // height1 = height1 == 0 ? 400 : height1;
                break;
            case 'h':
                operationParams['height1'] = trData[i].substr(1);
                // height1 = height1 == 0 ? 400 : height1;
                break;
            case 'w':
                operationParams['width1'] = trData[i].substr(1);
                // width1 = width1 == 0 ? 400 : width1;
                break;
            case 'q':
                operationParams['quality1'] = trData[i].substr(1);
                // quality1 = quality1 == 0 ? 40 : quality1;
                break;
            case 'f':
                operationParams['format'] = trData[i].substr(1);
                break;
            case 'p':
                operationParams['progressive'] = trData[i].substr(1);
                break;
            case 'e':
                "true" == trData[i].substr(1) ? operationParams['enhance'] = true : '';
                break;
            case 'c':
                "true" == trData[i].substr(1) ? operationParams['crop1'] = true : '';
                break;
            case 'g':
                operationParams['gravity1'] = trData[i].substr(1);
                break;
            default:
                break;
        }
    }
    operationParams['urlParamsType'] = "cloudinary";
    resizeImage(req, res, operationParams);
    // resizeImage('cloudinary', req, res, next, width1, height1, format, quality1, progressive, enhance, crop1, gravity1)
});

// as path parameter imageKit
router.get(['/:appId/:trData/:imageUrl', '/:appId/:trData/:imageUrl/*'], async (req, res, next) => {
    try {
        console.log("i m here 1111");
        var operationParams = {};
        // q80,h300,w400,fjpg,ptrue
       // var validIp = await validateIPCall(req);
        //console.log("validIp resp :", validIp);
        // if (!validIp)
        //     return res.status(404).json({ status: "unauth", message: "Invalid call, Your daily access limit has been exceeded.Contact Mogi I/O support. Or Register at https://tech.mogiapp.com " });

        let trData = req.params.trData || '';
        req.query.tr ? trData += "," + req.query.tr : '';
        if (trData.includes('-w') || trData.includes('-h') || trData.includes('-q') || trData.includes('-e') || trData.includes('-f') || trData.includes('-p') || trData.includes('-c')) trData = trData.split('-');
        else trData = trData.split(',');

        let width1, height1, enhance, format, quality1, progressive, crop1, gravity1;

        for (var i = 0; i < trData.length; i++) {

            if (trData[i].substring(0, 3) == "tr:") {
                trData[i] = trData[i].substr(3);
            }
            console.log("trData[i], ---- ", i, trData[i], trData[i].substr(1), trData[i].substring(0, 1))
            //ctrueface
            switch (trData[i].substring(0, 1)) {
                case 'o':
                    let oprs = trData[i].substr(1);
                    oprs = oprs.split("-");
                    oprs.forEach(element => {
                        if (isNaN(element)) {
                            operationParams[element] = true;
                        }
                        else {
                            operationParams.rotateAngle = element;
                        }
                    });

                    break;
                case 'h':
                    operationParams['height1'] = trData[i].substr(1);
                    //height1 = height1 == 0 ? 400 : height1;
                    break;
                case 'w':
                    operationParams['width1'] = trData[i].substr(1);
                    // width1 = width1 == 0 ? 400 : width1;
                    break;
                case 'q':
                    operationParams['quality1'] = trData[i].substr(1);
                    // quality1 = quality1 == 0 ? 40 : quality1;
                    break;
                case 'f':
                    operationParams['format'] = trData[i].substr(1);
                    break;
                case 'p':
                    operationParams['progressive'] = trData[i].substr(1);
                    break;
                case 'e':
                    "true" == trData[i].substr(1) ? operationParams['enhance'] = true : operationParams['enhance'] = false;
                    break;
                case 'c':
                    "true" == trData[i].substring(1, 5) ? operationParams['crop1'] = true : '';
                    "face" == trData[i].substring(5, 9) ? operationParams['faceCrop'] = true : '';

                    break;
                case 'g':
                    operationParams['gravity1'] = trData[i].substr(1);
                    break;
                case 'a':
                    operationParams['aspectRatio'] = trData[i].substr(1);
                    if (operationParams['aspectRatio'].length > 3 && operationParams['aspectRatio'].substr(3) == "face") {
                        operationParams.face = true;
                    }
                    operationParams['gravity1'] = operationParams['gravity1'] || 'center';
                    break;
                default:
                    break;
            }
        }
        let urlStr = req.originalUrl.split(req.params.trData+"/");
        console.log("urlStr :: ", urlStr);
        req.params.imageUrl = urlStr[1];

        console.log("111111111111v ", req.params.imageUrl, req.params.appId, operationParams);

        console.log(operationParams['quality1'] / 100);

        if (!req.params.imageUrl || (!req.params.appId && !req.params.imageUrl)) {
            console.log("hereeeeeeeeeee");
            return res.sendStatus(403);
        }

        operationParams['urlParamsType'] = "imageKitPathParams";
        // resizeImage('imageKitPathParams', req, res, next, width1, height1, format, quality1, progressive, enhance, crop1, gravity1)
        resizeImage(req, res, operationParams);
    }
    catch (e) {
        console.log("error in post of task", e.message, e.toString());
        res.json({ message: "error", error: e.message });
    }
});

// as query parameter mogiio
router.get(['/resize/:width/:height?', '/resize/:width/:height/*?'], async function (req, res, next) {
    var operationParams = {};
    var validIp = await validateIPCall(req);
    console.log("validIp resp :", validIp);
    if (!validIp)
        return res.status(404).json({ status: "unauth", message: "Invalid call, Your daily access limit has been exceeded.Contact Mogi I/O support. Or Register at https://tech.mogiapp.com " });
    // medium_cafe_B1iTdD0C.jpg?tr=w-200,h-200
    // as query parameter imageKit
    if (req.query.tr) {
        let urlStr = req.originalUrl.split('?');
        console.log("urlStr :: ", urlStr);
        urlStr = urlStr[0];
        req.params.appId = req.params.width;
        req.params.imageUrl = urlStr.split(req.params.appId + '/')[1];
        console.log("req.params.imageUrl :: ", req.params.imageUrl);
        if (!req.params.imageUrl || (!req.params.appId && !req.params.imageUrl)) {
            console.log("hereeeeeeeeeee");
            return res.sendStatus(403);
        }

        console.log("req.params :: ", req.params);
        let trData = req.query.tr;
        trData = trData.split(',');

        let width1, height1, enhance, format, quality1, progressive, crop1, gravity1;

        for (var i = 0; i < trData.length; i++) {

            if (trData[i].substring(0, 3) == "tr=") {
                trData[i] = trData[i].substr(3);
            }
            console.log(trData[i], trData[i].substring(0, 1))

            switch (trData[i].substring(0, 1)) {
                case 'h':
                    operationParams['height1'] = trData[i].substr(1);
                    // height1 = height1 == 0 ? 400 : height1;
                    break;
                case 'w':
                    operationParams['width1'] = trData[i].substr(1);
                    // width1 = width1 == 0 ? 400 : width1;
                    break;
                case 'q':
                    operationParams['quality1'] = trData[i].substr(1);
                    // quality1 = quality1 == 0 ? 40 : quality1;
                    break;
                case 'f':
                    operationParams['format'] = trData[i].substr(1);
                    break;
                case 'p':
                    operationParams['progressive'] = trData[i].substr(1);
                    break;
                case 'e':
                    "true" == trData[i].substr(1) ? operationParams['enhance'] = true : '';
                    break;
                default:
                    break;
            }
        }
        operationParams['urlParamsType'] = "imageKitQueryParams";
        // resizeImage('imageKitQueryParams', req, res, next, width1, height1, format, quality1, progressive, enhance, crop1, gravity1)
        resizeImage(req, res, operationParams)
    } else {

        // if (req.query.quality == 0 || !req.query.quality) req.query.quality = 70; // default set to 40
        // if (req.params.width == 0) req.params.width = 400; // default set to 400

        console.log("req.query --- ", req.query, !req.query.url, (!req.query.appId && !req.query.url));
        if (!req.query.url || (!req.query.appId && !req.query.url)) {
            console.log("hereeeeeeeeeee");
            return res.sendStatus(403);
        }

        operationParams['urlParamsType'] = "mogi";
        // resizeImage('mogi', req, res, next, req.params.width, req.params.height, req.query.format, req.query.quality, req.query.progressive, req.query.enhance, req.query.crop, req.query.gravity)
        resizeImage(req, res, operationParams)
    }
});

async function getConfig(req, id) {

    let conf = await req.app.redisClient.getAsync("conf" + id);
    if (conf) {
        return JSON.parse(conf);
    }
    else {
        conf = await Config.findById(req.params.appId || req.query.appId);
        await req.app.redisClient.setAsync("conf" + id, JSON.stringify(conf));
        await req.app.redisClient.expire("conf" + id, 3600);
        return conf;
    }

}

function nonImageProcessor(req, res, url, format) {
    let filename = url.split("/").pop();

    let tempFilename = Date.now() + filename;
    format == "js" ? tempFilename += "1" : "";
    console.log("format ::=> ", format, format.length, url, filename);
    res.set('Cache-Control', 'public, max-age=31557600, s-maxage=31557600');
    var contentEncoding = "";
    request({
        url: url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36'
        },
        withCredentials: false
    }, function (error, response, body) {
        console.log("respnse", response ? response.headers : "no response found");
        if (response && response.headers["content-encoding"]) contentEncoding = response.headers["content-encoding"];
        // else return res.status(404).json({ status: "invalidUrl", message: "Invalid file path or File doesn't exist on provided url. " + imageUrl });
    }).on('error', function (err) {
        console.log("inside error 1: ", err);
        // return res.sendStatus(404);
        return res.status(404).json({ status: "invalidUrl", message: "Invalid file path or File doesn't exist on provided url. " + imageUrl });
    }).pipe(fs.createWriteStream(__dirname + "/" + tempFilename))
        .on('finish', async (a, b, c) => {
            console.log(format, a, b, c);
            if (format == "js") {
                try {
                    await minify({
                        compressor: babelMinify,
                        input: __dirname + "/" + tempFilename,
                        output: "n" + tempFilename + "1",
                        callback: function (err, min) {
                            if (err) {
                                console.log("inside catch err of serve js : :", err);
                            }

                            res.contentType("application/x-javascript");

                            try {
                                if (contentEncoding) res.setHeader('Content-Encoding', contentEncoding);
                                let sendFileUrl = min ? req.app.basePathM + "/n" + tempFilename + "1" : __dirname + "/" + tempFilename;
                                res.sendFile(sendFileUrl);
                            }
                            catch (e) {
                                console.log("inside error 2: ", e, __dirname + "/" + tempFilename);
                                res.sendFile(__dirname + "/" + tempFilename);
                            }
                            res.on('finish', () => {
                                try {
                                    fs.unlinkSync(__dirname + "/" + tempFilename);
                                    fs.unlinkSync(req.app.basePathM + "/n" + tempFilename + "1");
                                }
                                catch (e) {
                                    console.log("catch err of fs.unlinkSync : ", e);
                                }
                            });
                        }
                    });
                }
                catch (e) {
                    console.log("error", e)
                }
            }
            else if (format == "css") {
                minify({
                    compressor: cleanCSS,
                    input: __dirname + "/" + tempFilename,
                    output: "n" + tempFilename,
                    callback: function (err, min) {
                        if (err) {

                        }
                        res.contentType("text/css");
                        console.log(min.length);


                        console.log("ops.dstPath", req.app.basePathM);
                        try {
                            if (contentEncoding) res.setHeader('Content-Encoding', contentEncoding);
                            let sendFileUrl = min ? req.app.basePathM + "/n" + tempFilename : __dirname + "/" + tempFilename;
                            res.contentEnco
                            res.sendFile(sendFileUrl);
                        }
                        catch (e) {
                            console.log("inside error 3: ", err, __dirname + "/" + tempFilename);
                            //res.set('Cache-Control', 'public, max-age=31557600, s-maxage=31557600');
                            res.sendFile(__dirname + "/" + tempFilename);
                        }
                        res.on('finish', () => {
                            try {
                                fs.unlinkSync(__dirname + "/" + tempFilename);
                                fs.unlinkSync(req.app.basePathM + "/n" + tempFilename);
                            }
                            catch (e) {
                                console.log("catch err of fs.unlinkSync : ", e);
                            }
                        });

                    }
                });
            }
        });
}

// urlParamsType, req, res, next, width1, height1, format, quality1, progressive, enhance, crop1, gravity1
async function resizeImage(req, res, operationParams) {
    // console.log(" urlParamsType :: ", arguments);
    console.log(" operationParams :: ", operationParams, (req.params.appId || req.query.appId));

    var configObj;
    // if (req.params.appId != 'mogiio-enhance' && (req.params.appId || req.query.appId)) {
    //     console.log("inside if call getConfif");
    //     configObj = await getConfig(req, req.params.appId || req.query.appId);

    //     if (configObj && configObj.imgDefaultConf) {
    //         operationParams['quality1'] = operationParams['quality1'] || configObj.imgDefaultConf.quality || 100;

    //         if (operationParams['progressive'] == false) {
    //             operationParams['progressive'] = false;
    //         } else {
    //             operationParams['progressive'] = configObj.imgDefaultConf.progressive || true;
    //         }
    //         if (operationParams['enhance'] == false) {
    //             operationParams['enhance'] = false;
    //         } else {
    //             operationParams['enhance'] = configObj.imgDefaultConf.enhance || true;
    //         }

    //     }

    // } else {
    //     // encodeURI(req.query.url);
    // }
    const startTime = Date.now();

    let tempFormat = false;
    console.log("req.headers.accept :: ", req.headers.accept);
    // if (req.headers.accept && req.headers.accept.indexOf('image/webp') !== -1) {
    //     //format = format || 'webp'
    //     tempFormat = true;
    //     operationParams.webpSupport = true;
    // }

    let bucketUrl = '';
    // if (configObj && configObj.imgSourcePath) {
    //     checkProtocol = configObj.imgSourcePath.startsWith('https');
    //     bucketUrl = configObj.imgSourcePath;
    // }

    var imageUrl;
    console.log("req.params.imageUrl : ", req.params.imageUrl.substr(1, req.params.imageUrl.length - 1))
    if (req.params.appId == 'mogiio-enhance') {
        imageUrl = await getImageUrl('', req.params.imageUrl.substr(1, req.params.imageUrl.length - 1));
        // https://image2.mogiio.com/mogiio-enhance/w800,fjpg,q100/mogiio.com/images/logo1.png
    } else {
        imageUrl = await getImageUrl(bucketUrl, operationParams.urlParamsType == "mogi" ? req.query.url : req.params.imageUrl)
    }

    var tempFormatByUrl = imageUrl.split('?').shift();
    tempFormatByUrl = tempFormatByUrl.split('.').pop();

    console.log("temp format by url", tempFormatByUrl)
    if (tempFormatByUrl == "css" || tempFormatByUrl == "js") {
        return nonImageProcessor(req, res, imageUrl, tempFormatByUrl);
    }

    console.log("format :: ", operationParams['format']);
    var autoFormat = false;
    if (operationParams['format'] == "auto") {
        operationParams.realFormat = "auto";
        var extArr = imageUrl.split('.');
        operationParams['format'] = extArr[extArr.length - 1];
        autoFormat = true;
    }
    else if (operationParams['format'] == '') {
        var extArr = imageUrl.split('.');
        operationParams['format'] = extArr[extArr.length - 1];
    }

    operationParams['format'] == 'jpg' ? operationParams['format'] = 'jpeg' : '';

    let filename = Date.now() + req.params.imageUrl.split("/").pop();

    try {
        console.log("rahul resize 1", new Date());
        // check if sourceServiceConf available i.e. private s3 bucket
        // then download with s3 

        if (configObj && configObj.sourceServiceConf && configObj.sourceServiceConf.accessKey && configObj.sourceServiceConf.accessToken) {
            // fileName = await awsS3Download(configObj.sourceServiceConf, imageUrl, filename, req.app['basePathM'] + "/");

            // operationParams.imageUri = req.app['basePathM'] + "/" + filename;
            // imgBySharp(req, res, operationParams);
            // const endTime = Date.now();

            // if (req.params.appId == 'mogiio-enhance') {

            // } else {
            //     updateToDB(req, imageUrl, operationParams, (endTime - startTime));
            // }
        }
        else {
            res.setTimeout(100000, function(){
                console.log('>>>Big issue: Request has timed out.<<<');
                return res.status(408).sendFile(__dirname + "/404_not_found.jpg");
            });

            const reqCheck = request({
                url: imageUrl,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36'
                },
                withCredentials: false,
                timeout: 3000
            }).on('error', function (err) {
                console.log("inside error 4: ", err);
                // return res.sendStatus(404);
                return res.status(206).sendFile(__dirname + "/404_not_found.jpg");
                // return res.status(404).json({ status: "invalidUrl", message: "Invalid file path or File doesn't exist on provided url. " + imageUrl });
            }).on('response', function(response) {
                console.log("response.statusCode : ", response.statusCode, "response.content-type : ", response.headers['content-type']) // 200
                
                if (response.statusCode === 200) {
                    reqCheck.pipe(fs.createWriteStream(filename))
                    .on('finish', async () => {
                        console.log("rahul resize 2", new Date(), filename);
    
                        //if (!operationParams['enhance']) {
                        operationParams.imageUri = req.app['basePathM'] + "/" + filename;
                        imgBySharp(req, res, operationParams);
                        const endTime = Date.now();
    
                        if (req.params.appId == 'mogiio-enhance') {
    
                        } else {
                            updateToDB(req, imageUrl, operationParams, (endTime - startTime));
                        }
    
                    })
                }
                else {
                    return res.status(206).sendFile(__dirname + "/404_not_found.jpg");
                }

                console.log("response.content-type : ", response.headers['content-type']) // 'image/png'
            })
            // .pipe(fs.createWriteStream(filename))
            //     .on('finish', async () => {
            //         console.log("rahul resize 2", new Date(), filename);

            //         //if (!operationParams['enhance']) {
            //         operationParams.imageUri = req.app['basePathM'] + "/" + filename;
            //         imgBySharp(req, res, operationParams);
            //         const endTime = Date.now();

            //         if (req.params.appId == 'mogiio-enhance') {

            //         } else {
            //             updateToDB(req, imageUrl, operationParams, (endTime - startTime));
            //         }

            //     })
        }
    } catch (err) {
        console.log("inside catch error of request : ", err);
        return res.sendStatus(404);
        //return res.json({ status: "invalidUrl", message: "Invalid file path or File doesn't exist on provided url - " + imageUrl });
    }
}

module.exports = router;

function getFaceGravity(fileLocation) {
    try {
        // console.log("fileLocation :: ", cv, "fl : ", fileLocation);
        const image = cv.imread(fileLocation);
        //console.log("image with cv.iimread :: ", image);
        //const image = cv.imread("/Users/rahullahoria/Desktop/Screenshot\ 2020-03-03\ at\ 11.01.40\ AM.png");
        const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_DEFAULT);

        // detect faces
        const {
            objects
        } = classifier.detectMultiScale(image.bgrToGray());

        //    console.log(objects,image)
        if (objects.length <= 0) {
            return {
                gravity: "center",
                status: false
            }
        }
        //console.log(objects[0].x-(image.cols/2),objects[0].y-(image.rows/2))

        let x = objects[0].x + objects[0].width / 2;
        let y = objects[0].y;

        let xFactor = image.cols / 3;
        let yFactor = image.rows / 3;

        let xLocation = Math.floor(x / xFactor);
        let yLocation = Math.floor(y / yFactor);
        let gravity = {
            "00": "northwest",
            "01": "north",
            "02": "northeast",
            "10": "west",
            "11": "center",
            "12": "east",
            "20": "southwest",
            "21": "south",
            "22": "southeast",

        }
        console.log("xLocation ::: ", xLocation, yLocation, gravity[yLocation + "" + xLocation]);

        return {
            gravity: gravity[yLocation + "" + xLocation],
            faceX: Math.round(objects[0].x * 0.9),
            faceY: Math.round(objects[0].y * 0.7),
            faceWidth: Math.round(objects[0].width * 1.25),
            faceHeight: Math.round(objects[0].height * 1.25),
            status: true
        }


    } catch (error) {
        console.log("openCV catch error : ", error);
        return {
            status: false,
            gravity: "Center"
        }
    }
}

async function imgBySharp(req, res, ops) {

    try {
        if (ops['aspectRatio']) {
            if (ops.face) {
                let faceRes = await getFaceGravity(ops.imageUri);
                console.log("faceRes :: in aspectRatio LL ", faceRes);
                ops.gravity1 = faceRes.gravity || ops.gravity1;

            }
            ops.customArgs = ops.customArgs.concat((" -gravity " + ops['gravity1'] + " -crop " + ops['aspectRatio']).split(" "))
        }

        let formats = ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'heif', 'raw', 'tile'];

        if (formats.indexOf(ops.format) < 0) ops.format = 'jpeg';


        console.log("ops ::: in imgBySharp :  ", ops);
        if (ops.webpSupport && (ops.realFormat == "auto" || !ops.format)) ops.format = "webp";

        res.set('Cache-Control', 'public, max-age=31557600, s-maxage=31557600');
        res.contentType("image/" + ops.format);

        var s = sharp(ops.imageUri);

        s.metadata()
            .then(async function (metadata) {

                if (ops.width1 || ops.height1) {
                    let obj = {};
                    if (ops.width1) metadata.width < 1 * ops.width1 ? obj.width = metadata.width : obj.width = 1 * ops.width1;
                    if (ops.height1) metadata.height < 1 * ops.height1 ? obj.height = metadata.height : obj.height = 1 * ops.height1;
                    s = s.resize(obj);
                }
                if (ops.faceCrop) {
                    let faceRes = await getFaceGravity(ops.imageUri);
                    if (!faceRes.status) {
                        res.status(404);
                        return res.json({ status: 404, message: "no face found" });
                    }
                    console.log("faceRes :: in ops faceCrop LL ", faceRes);
                    s = s.extract({ left: faceRes.faceX, top: faceRes.faceY, width: faceRes.faceWidth, height: faceRes.faceHeight })

                }
                if (ops.enhance) {
                    s = s.sharpen(1.5, 1, 1);
                }
                if (ops.flip) {
                    s = s.flip();
                }
                if (ops.flop) {
                    s = s.flop();
                }
                if (ops.rotate) {
                    s = s.rotate(ops.rotateAngle * 1);
                }
                // if(ops.format == "jpeg" && req.params.imageUrl.split(".").pop() == "png" ) {
                //     s.background().flatten().jpeg()
                // }

                s[ops.format](
                    {
                        quantisationTable: 8,
                        overshootDeringing: true,
                        optimiseScans: true,
                        trellisQuantisation: true,
                        quality: ops.quality ? (ops.quality * 0.6) : 60,
                        progressive: true,
                        lossless: false,
                        chromaSubsampling: '4:2:0',
                        reductionEffort: 6
                    }
                )
                    .toColorspace("srgb")
                    // .blur(0.5)
                    .toBuffer()

                    .then(data => {
                        res.end(data)
                    })
                res.on('finish', () => {
                    try {
                        fs.unlinkSync(ops.imageUri);
                        //fs.unlinkSync(filename);
                    }
                    catch (e) {
                        console.log("s.metadata catch err : ", ops.imageUri, e);
                    }
                });


            });

    } catch (error) {
        console.log("openCV catch error : ", error);
        res.status(404);
        return res.json({ status: 404, message: error.message });
    }

}

function getWHbyA(w, h, a) {
    //1:2 = 0.5
    if (a < 1) {
        return { width: w, height: w * a };
    }
    return { width: h * a, height: h };

}
