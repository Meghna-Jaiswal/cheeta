const { Response, BadRequestResponse } = require("../../lib/response");
const CheeteOKR = require('../../models/okr');


module.exports = {
    deleteOKR: async (req, res, next) => {

        console.log('Deleteing OKR');

        try {

            if(!(req.params.id && req.params.id.length === 24)) 
                    return res.status(400)
                    .json(new BadRequestResponse('Invalid Id'));


            let result = await CheeteOKR.findOneAndUpdate({_id: req.params.id}, {$set: {status: 2}}, {new: true, useFindAndModify: false});

            console.log(result)

            return res.json(new Response(200, "OKR Succesfully Deleted!", {}));

        }
        catch (err) {
            console.log(err)
            return res.status(400).json(new BadRequestResponse("Something went wrong! " + err));
        }
    }
}