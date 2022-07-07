const { Response, BadRequestResponse } = require("../../lib/response");
const CheetaUsers = require('../../models/cheeta-users'); 



module.exports = {
    deleteUser: async (req, res, next) => {

        console.log('Deleteing User');

        try {

            if(!(req.params.id && req.params.id.length === 24)) 
                    return res.status(400)
                    .json(new BadRequestResponse('Invalid UserId'));


            let result = await CheetaUsers.findOneAndUpdate({_id: req.params.id, status: "active"}, {$set: {status: "deleted"}}, {new: true, useFindAndModify: false});

            console.log(result)
            if(!(result && result.status == 'deleted'))
                return res.status(400)
                    .json(new BadRequestResponse('User already deleted!'));

            return res.json(new Response(200, "User Succesfully Deleted!", {}));

        }
        catch (err) {
            console.log(err)
            return res.status(400).json(new BadRequestResponse("Something went wrong! " + err));
        }
    }
}