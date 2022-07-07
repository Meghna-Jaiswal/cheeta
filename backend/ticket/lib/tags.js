const axios = require('axios');


module.exports = {

    saveTags: async (req, data) => {

        return new Promise(async (resolve, reject) => {

            try {
    
                const options = {
                    method: 'POST',
                    url: process.env.CHEETA_TAGS_URL || 'http://localhost:3070/cheeta-tags/',
                    headers: {
                        'content-type': "application/json",
                        authorization: req.headers.authorization
                    },
                    data
                }
        
    
                let resp = await axios(options)
                
                // console.log(resp)
                
                if(resp && resp.data) resolve(resp.data.data.tagsIdArr);
                else throw "tagId not saved";
    
            }catch(err) {
    
                console.log('error in saving tags ::', err);
                reject(err);
                
            }
        })


    },

    getTagNames: async (req, data) => {

        return new Promise(async (resolve, reject) => {

            try {
                // console.log(data)
    
                for(let i=0 ; i<data.length ; i++) {
                    if(data[i].tags.length)
                        data[i].tags = await getTagName(req, data[i].tags)
                }
                
                resolve(data)
    
            }catch(err) {
    
                console.log('error in gettin tag names ::', err);
                reject(err);
                
            }
        })


    },


    getTagIds: async (req, data) => {

        return new Promise(async (resolve, reject) => {

            try {
                // console.log(data)

                let url = process.env.CHEETA_TAGS_URL || 'http://localhost:3070/cheeta-tags/';
                url += 'getTagIds'
    
                const options = {
                    method: 'POST',
                    url,
                    headers: {
                        'content-type': "application/json",
                        authorization: req.headers.authorization
                    },
                    data: {tags : [...data]}
                }
        
    
                let resp = await axios(options)
                
                resolve(resp.data.data)
    
            }catch(err) {
    
                console.log('error in gettin tag names ::', err);
                reject(err);
                
            }
        })


    },


    projectsWithIds: async (req) => {

        return new Promise(async (resolve, reject) => {

            try {
                // console.log(data)

                let url = process.env.CHEETA_TAGS_URL || 'http://localhost:3070/cheeta-tags/';
                url += 'projectsWithIds'
    
                const options = {
                    method: 'GET',
                    url,
                    headers: {
                        'content-type': "application/json",
                        authorization: req.headers.authorization
                    }
                }
        
    
                let resp = await axios(options)
                
                resolve(resp.data.data)
    
            }catch(err) {
    
                console.log('error in gettin tag names ::', err);
                reject(err);
                
            }
        })

    }


}






async function getTagName(req, data) {
    // console.log("tags in func ::", data)
    return new Promise((resolve, reject) => {
        try {
            let url = process.env.CHEETA_TAGS_URL || 'http://localhost:3070/cheeta-tags/';
            url += 'getTagNames'
        
            const options = {
                method: 'POST',
                url,
                headers: {
                    'content-type': "application/json",
                    authorization: req.headers.authorization
                },
                data: { tagIds: [...data] }
            }
        
        
            let resp = await axios(options)
            
            // console.log(resp)
            
            if(resp && resp.data) {
                if(resp.data.length) return resolve(resp.data.data);
                return resolve(['Tag Deleted']);
            }

        }catch(e) {
            console.log('Error in gettin tag name :: \n', e);
            reject(e)
        }
    })


}