const { Response, BadRequestResponse } = require("../../lib/response");
const CheetaTicket = require('../../models/cheetaTicket');
const { projectsWithIds, getTagIds, getTagNames } = require("../../lib/tags");
const getHrId = require('../../lib/getHrId');


module.exports = {
    getAllTickets: async (req, res, next) => {
        try{
            console.log('Getting all tickets')
            let results = await CheetaTicket.find({ status: { $in: [0,1] }});

            let count = await CheetaTicket.countDocuments();

            let flag = 0;

            for(let i=0 ; i<results.length ; i++) {
                if('hrId' in results[i])
                    await CheetaTicket.findOneAndUpdate({_id: results[i]._id}, {$set: {hrId: getHrId(count)}}, {new: true, useFindAndModify: false})

                flag++;
            }

            if(flag) results = await CheetaTicket.find({ status: { $in: [0,1] }});

            return res.json({
                        status: {
                            code: 200,
                            message: "Successfull!"
                        },
                        data: results
                    })

        } catch (e) {
          console.error(e);
      
          return res
            .status(400)
            .json(new BadRequestResponse("Something went wrong!"));
        }
    },


    // To show table based on projext X priority
    getTicketSummary: async (req, res, next) => {
        try{

            let projects = await projectsWithIds(req);

            let results = [];
            
            

            for(let i=0 ; i<projects.length ; i++) {
                let sum = await CheetaTicket.aggregate([
                            {
                                $match: {
                                    tags: { $in: [projects[i].id] },
                                    status: { $in: [0,1] }
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        state: "$state",
                                        priority: "$priority"
                                    },
                                    count: {
                                        "$sum": 1
                                    }
                                }
                            },
                            {    $group: {
                                    _id: "$_id.state",
                                    ticketsCount: {
                                        $push: {
                                            priority: "$_id.priority",
                                            count: "$count"
                                        }
                                    }
                                } 
                            },
                        ])

                let obj = {};
                obj[projects[i].name] = [...sum];
                        
                console.log(obj)
                results.push({...obj});
            }
            console.log(results)

            return res.json({
                        status: {
                            code: 200,
                            message: "Successfull!"
                        },
                        data: results
                    }) 

        } catch (e) {
          console.error(e);
      
          return res
            .status(400)
            .json(new BadRequestResponse("Something went wrong!"));
        }
    },

    search: async (req, res, next) => {
        try{
            console.log('Search tickets', req.query)

            if(!req.query.term)
                return res.json({
                        status: {
                            code: 200,
                            message: "Successfull!"
                        },
                        data: []
                    })
                    
            // Search for : 
            // Tags
            // Title
            // Priority
            // Members
            // hrId

            const searchTerm = req.query.term;
            const searchTermRegExp = new RegExp(searchTerm,'gi')

            let $or = [
                {
                    tags: {
                        $in: await getTagIds(req, [searchTerm])
                    }
                },
                {
                    title: searchTermRegExp
                },
                {
                    priority: searchTermRegExp
                },
                {
                    members: { $elemMatch: { email: searchTermRegExp } }
                },
                {
                    members: { $elemMatch: { name: searchTermRegExp } }
                },
                {
                    hrId: searchTermRegExp
                }
            ];
            

            let results = await CheetaTicket.find({ status: { $in: [0,1] }, $or });

            if(results)
                results = await getTagNames(req, results);

            return res.json({
                        status: {
                            code: 200,
                            message: "Successfull!"
                        },
                        data: results
                    })

        } catch (e) {
          console.error(e);
      
          return res
            .status(400)
            .json(new BadRequestResponse("Something went wrong!"));
        }

    }
}