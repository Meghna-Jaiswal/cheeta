const bcrypt = require('bcrypt');

module.exports = async (req) => {

    if(
        req.body.email &&
        req.body.mobile &&
        req.body.password &&
        req.body.type
    ) {
        const hash = await bcrypt.hash(req.body.password, 10);

        return {
            created: true,
            obj: {
                name: req.body.name? req.body.name : '',
                email: req.body.email,
                mobile: req.body.mobile,
                password: hash,
                type: req.body.type,
                profilePic: req.body.profilePic? req.body.profilePic: "", // Add a default DP
                score: 0,
                status: "deactivated",
                others: {
                    otp: Math.floor(1000 + Math.random() * 9000)
                }
            }
        }
    }
    else
        return {
            created: false,
            obj: {}
        }
}
