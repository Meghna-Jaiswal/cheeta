const axios = require('axios');

module.exports = {
    scoreChange: (data) => {
        return new Promise(async (resolve, reject) => {

            try {

                let url = process.env.CHEETA_USERS_URL || 'http://localhost:3069/cheeta-users/';
                url += 'scoreChange'

                let options = {
                    method: 'put',
                    url,
                    headers: {
                        'content-type': 'application/json',
                        'authorization': 'global_jwt_fndsjkbgj23432fdfb'
                    },
                    data
                }

                let resp = await axios(options)
                
                console.log(resp)
                
                if(resp && resp.data) resolve();
                else throw "scores not changed";

            } catch(err) {
                console.log('error in changing scores ::', err);
                reject(err);
            }
        })
    }
}