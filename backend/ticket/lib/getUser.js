const axios = require('axios');
const CHEETA_USERS_URL = process.env.CHEETA_USERS_URL 


async function getUser(userId) {

    return new Promise((resolve, reject) => {

        if (userId === undefined) return console.log('returning getuser')

        try {
            console.log(`getting telegam id --> ${userId}`);
            var options = {
                method: 'GET',
                url: `${CHEETA_USERS_URL}${userId}`,
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'global_jwt_fndsjkbgj23432fdfb'
                }
            };
            axios(options).then(async (response) => {
                if (response) {
                    console.log("Cheeta user reponse ::", response.data);
                    resolve(response.data.data)
                } else {
                    resolve(false)
                }
            }).catch((err) => {
                console.log("got error while getting userid to cheeta user #1 : ", err);
                resolve(false)
            })
        }
        catch (error) {
            console.log("got error while getting userid to cheeta user #2", error);
            resolve(false)
        }
    })
}


module.exports = getUser;