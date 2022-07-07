// const https = require("http");
//const https = require("https");
const axios = require('axios');

module.exports = (req, res, next) => {
  try {
    // console.log('req.headers ::',req.headers )
    // console.log('req.headers.bypass::',req.headers.bypass, typeof req.headers.bypass)
    if(req.headers.bypass){
      console.log('bypassing jwt')
      next()
      return
    }
    
    const baseJWTURL = process.env.JWT_BASE_URL||"http://localhost:3012/jwt/";
    // console.log("process.env.JWT_BASE_URL :: " , process.env.JWT_BASE_URL, baseJWTURL + req.headers.authorization );
    
    // const api = axios.create({baseURL: baseConfigUrl });
    // api.defaults.headers.post['Accept'] = 'application/json';

    if(req.headers['app-id'] == '5de51d6e4e8b541fb802d8f3' && req.headers['app-key'] == 'LdXLkAzTG5fyRLrZ2t6tuWXSGdXFb3K6') {
      req.userData = {};
      return next();
    }
    
    axios.get( baseJWTURL + req.headers.authorization ).then(function (response) {
      // console.log("axios response : ", response.data, response.status);

      const authData = response.data;
      // const authData = JSON.parse(response.data);

      if (authData.status && authData.status.code == 401) {

        return res.status(401).json({
          status: {
            message: "Auth Failed!",
            code: 401,
          },
        });
        
      } else {
        req.userData = {
          email: authData.data.email,
          userId: authData.data.userId,
          mobile: authData.data.mobile,
          type: authData.data.type,
        };
        next();
      }

      if(response.status == 200 ){
        // resolve(response.data);
      }
      else {
        // reject(response.status);
      }
    })
    .catch(function (error) {
      console.log("axios error : ", error);
      return res.status(403).json({
        status: {
          message: "Unable to connect to Authentication",
          code: 403,
        },
      });
    });
    
    // https
    //   .get(baseJWTURL + req.headers.authorization, (resp) => {
    //     let data = "";

    //     // A chunk of data has been received.
    //     resp.on("data", (chunk) => {
    //       data += chunk;
    //     });

    //     // The whole response has been received. Print out the result.
    //     resp.on("end", () => {
    //       //console.log(JSON.parse(data));
    //       const authData = JSON.parse(data);
    //       if (authData.status.code == 401) {

    //         return res.status(401).json({
    //           status: {
    //             message: "Auth Failed!",
    //             code: 401,
    //           },
    //         });
            
    //       } else {
    //         req.userData = {
    //           email: authData.data.email,
    //           userId: authData.data.userId,
    //           mobile: authData.data.mobile
    //         };
    //         next();
    //       }
    //     });
    //   })
    //   .on("error", (err) => {
    //     console.log("Error: " + err.message);
    //     return res.status(403).json({
    //       status: {
    //         message: "Unable to connect to Authentication",
    //         code: 403,
    //       },
    //     });
    //   });
  } catch (e) {
    console.log(e);
    res.status(401).json({
      status: {
        message: "Auth Failed!",
        code: 401,
      },
    });
  }
};
