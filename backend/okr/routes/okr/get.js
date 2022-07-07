const { Response, BadRequestResponse } = require("../../lib/response");
const CheetaOKR = require('../../models/okr');

module.exports = {
    getUserOKR: async (req, res, next) => { 
        try {
            console.log("Users OKR \n userId ::", req.params.userId);

            if(!(req.params.userId && req.params.userId.length === 24)) 
                return res.status(400)
                  .json(new BadRequestResponse('Invalid UserId'));


            let result = await CheetaOKR.find({userId: req.params.userId, status: 1});

            console.log(result);

            return res.json(new Response(201, "Succesfully!", result));

        }
        catch (err) {
            console.log(err)
            return res.status(400).json(new BadRequestResponse("Something went wrong! " + err));
        }
    },

}