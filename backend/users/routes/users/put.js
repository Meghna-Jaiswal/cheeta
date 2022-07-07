const { Response, BadRequestResponse } = require("../../lib/response");
const props = require('../../validators/updatableUserProps');
const CheetaUsers = require('../../models/cheeta-users');


module.exports = {
    updateProfile: async (req, res, next) => {
        try {
            console.log("Update User \n body ::", req.body);

            let obj = req.body;
            let keys = Object.keys(obj);
            let update = {};

            keys.forEach(key => {
                if(props.includes(key)) update[key] = obj[key];
            })

            console.log('Update obj ::', update);

            let result = await CheetaUsers.findByIdAndUpdate(req.params.id, {$set:update}, {new: true, useFindAndModify: false});

            res.json(new Response(200, "Updated Succesfully!", result));

        }
        catch (err) {
            console.log(err)
            res.status(400).json(new BadRequestResponse("Something went wrong! " + err));
            next();
        }

    },


    scoreChange: async (req, res, next) => {
        try {
            console.log("Update User \n body ::", req.body);

            let update = req.body.users;
            
            console.log('Update obj ::', update);

            update.forEach(async (u) => {
                let result = await CheetaUsers.findOneAndUpdate({_id: u.id, status: 'active'},
                                                                {$inc:{ score: u.score }}, 
                                                                {new: true, useFindAndModify: false});
            })


            res.json(new Response(200, "Updated Succesfully!", ''));

        }
        catch (err) {
            console.log(err)
            res.status(400).json(new BadRequestResponse("Something went wrong! " + err));
            next();
        }
    }
}