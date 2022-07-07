var http = require("http");
const axios = require('axios');

async function getJwt(email, password, userId, mobile) {
  return new Promise( async (resolve, reject) => {
    try {
      if(process.env.NODE_ENV == 'test1'){
        return resolve({data:"123456"})
      }
      process.env.JWT_BASE_URL ?http = require("https"):'';

      const baseConfigUrl = ( process.env.JWT_BASE_URL || "http://localhost:3012/jwt/" )
      let pathUrl = email+"/login";
      console.log("BaseUrl :::  ", baseConfigUrl, "data to jwt : ", { email, password, userId, mobile} );

      var options = {
        method: "POST",
        preambleCRLF: true,
        postambleCRLF: true,
        url: baseConfigUrl + pathUrl,
        headers: {
          "Content-Type": "application/json",
          authorization: process.env.GLOBAL_JWT,
        },
        data: { email, password, userId, mobile }
      };

      axios(options)
        .then(async (response) => {
          // console.log("send");

          if (response) {
            console.log("request response : : :", response["data"]);
            resolve(response["data"]);
          } else {
            console.log("HERE");
            resolve(false);
          }
        })
        .catch((err) => {
          console.log(err);
          resolve(false);
        });
      
    }catch (e) {
      console.log( "inside main catch err of getJwt lib : ", e);
      reject(e);
    }
  })
}

module.exports = getJwt;