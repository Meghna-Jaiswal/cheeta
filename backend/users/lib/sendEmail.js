const axios = require("axios");

async function sendEmail(rec, sub, msg, token) {
  console.log({rec})
  return new Promise(async (resolve, reject) => {
    let emailUrl= process.env.EMAIL_BASE_URL || 'http://localhost:3020/email'
    console.log({emailUrl})

      const options = {
        url: emailUrl + `61a89cca0ee30246db13a504/emails`,
        method: 'post',
        headers: {
          "Content-Type": "application/json",
          "authorization": process.env.GLOBAL_JWT || 'global_jwt_fndsjkbgj23432fdfb',
        },
        data: { 
          recipients: rec,
          subject: sub,
          message: msg
        }
      };
      
    axios(options) 
    .then(function (response) {
      // console.log({response});
      if(response) resolve(true)
        else resolve(false);
    })
    .catch(function (error) { 
      console.log('Email failure:::', error.message); 
      // console.log(error);
      resolve(error)
    }); 
  });
}



// const nodemailer = require("nodemailer");

// // async..await is not allowed in global scope, must use a wrapper
// async function sendEmail(rec, sub, msg) {

//   return new Promise(async (resolve, reject) => {
//     if (!rec || !sub || !msg) return;

//     let temp = await sendGridEmail(rec, sub, msg);
//     console.log("temp reso of sendGridEmail : ", temp);
//     if(temp) resolve(true);

//     else resolve(false);
//   });
// }

// function sendGridEmail(rec, sub, msg) {
//   // using Twilio SendGrid's v3 Node.js Library
//   // https://github.com/sendgrid/sendgrid-nodejs

//   /* Set API key to env variable
//     echo "export SENDGRID_API_KEY='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'" > sendgrid.env
//     echo "sendgrid.env" >> .gitignore
//     source ./sendgrid.env
//   */
//   return new Promise( (resolve, rejects) => {
//     try {
//       const sgMail = require('@sendgrid/mail');
//       // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//       // console.log("process.env.SENDGRID_API_KEY : ", process.env.SENDGRID_API_KEY);

//       sgMail.setApiKey("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");

//       const msgOptions = {
//         // to: 'rajnish@mogiio.com',
//         // to: ['rahul@mogiio.com','rajnish@mogiio.com','support@boomagift','im.rajnish.panwa@gmail.com','rajnish_pawar90@yahoo.com'],
//         from: 'info@mogiio.com',
//         to: rec, // list of receivers
//         subject: sub, // Subject line
//         text: msg, // plain text body
//         html: "<b>" + msg + "</b>" // html body
//       };

//       sgMail.send(msgOptions).then(() => {
//         console.log("sendingEmail done 1");
//         resolve(true);
//       }, error => {
//         if (error) {
//           console.error("sendgrid err: ", error);
//           resolve(false);
//         }
//         else {
//           console.log("sendingEmail done");
//           resolve(true);
//         }
//       });
//     }
//     catch(err) {
//       console.log("sendingEmail catch err : ", err);    
//       resolve(false);
//     }
//   });
// }

// sendEmail('rajnish@mogiio.com', 'Test with api key', 'Hello, emial via sendgrid');
// sendGridEmail('rajnish@mogiio.com', 'Test with api key', 'Hello, emial via sendgrid');

//main().catch(console.error);





module.exports = sendEmail;
