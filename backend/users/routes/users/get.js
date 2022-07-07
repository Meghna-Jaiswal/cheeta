const { Response, BadRequestResponse } = require("../../lib/response");
const CheetaUsers = require('../../models/cheeta-users'); 


module.exports = {
    getUserInfo: async (req, res, next) => { 
        try {
            console.log("User Info \n Id ::", req.params.id);

            if(!(req.params.id && req.params.id.length === 24)) 
                return res.status(400)
                  .json(new BadRequestResponse('Invalid UserId'));


            let result = await CheetaUsers.findById(req.params.id);

            if(!result)
                return res.status(400).json(new BadRequestResponse("No Such User!"));

            let obj = {...result._doc}
            delete obj.password;

            return res.json(new Response(201, "Succesfully!", obj));

        }
        catch (err) {
            console.log(err)
            return res.status(400).json(new BadRequestResponse("Something went wrong! " + err));
        }
    },


    getUsersList: async (req, res, next) => {
        try {
            console.log("Getting Users List");

            // name email userId
            let result = await CheetaUsers.aggregate([
                    {
                        $match: {
                            status: "active"
                        }
                    },
                    {
                        $project: {
                            _id: "$_id",
                            email: "$email",
                            name: "$name",
                            type: "$type",
                            profilePic: "$profilePic"
                        }
                    }
                ])

            return res.json(new Response(200, "Succesfull!", result));

        }
        catch (err) {
            console.log(err)
            return res.status(400).json(new BadRequestResponse("Something went wrong! " + err));
        }
    },

    getUserFromTelegram: async (req, res, next) => {
        try {
            console.log("Getting User Info from tg\n Id ::", req.params.id);

            let result = await CheetaUsers.findOne({'telegram.id': Number(req.params.id)});
            if(!result)
                return res.status(400).json(new BadRequestResponse("No Such User!"));
            let obj = {...result._doc}
            delete obj.password;

            return res.json(new Response(201, "Succesfully!", obj));

        }

        catch (err) {
            console.log(err)
            return res.status(400).json(new BadRequestResponse("Something went wrong! " + err));
        }
    },


    getScores: async (req, res, next) => {
        try {
            console.log("Getting Scores", req.userData);

            let user = await CheetaUsers.findById(req.userData.userId);

            // name email userId
            let result = await CheetaUsers.aggregate([
                    {
                        $match: {
                            status: "active"
                        }
                    },
                    {
                        $project: {
                            _id: "$_id",
                            email: "$email",
                            name: "$name",
                            type: "$type",
                            score: '$score',
                            profilePic: "$profilePic"
                        }
                    },
                    { $sort: { score: -1 } },
                ]).limit(5)

            return res.json({
                status: {
                    code: 200,
                    message: "Succesfull!"
                },
                data: {
                    userScore: user?user.score:0,
                    topPerformers: [...result]
                }
            })

        }
        catch (err) {
            console.log(err)
            return res.status(400).json(new BadRequestResponse("Something went wrong! " + err));
        }
    }
}