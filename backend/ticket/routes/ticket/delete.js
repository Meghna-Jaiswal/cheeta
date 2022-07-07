const { Response, BadRequestResponse } = require("../../lib/response");
var CheetaTicket = require("../../models/cheetaTicket");

module.exports = {

    deleteTicket: async function (req, res, next) {
        try {
            if(!req.params.id) 
            return res.status(400).json({
                status: {
                    code: 400,
                    message: "Insufficient info!"
                }
            })
           
            let result = await CheetaTicket.findOneAndUpdate({ _id: req.params.id }, { $set: { "status": 2 } }, { upsert: false, new: true });
                
            
            if (result && result.status === 2) {

                    return res.json({
                        status: {
                            code: 200,
                            message: " Deleted Successfully!"
                        }
                    })

                }

                    return res.json({
                        status: {
                            code: 400,
                            message: "Invalid Id"
                        }
                    })

        }
        catch (e) {
            console.error(e);
        
            return res
              .status(400)
              .json(new BadRequestResponse("Something went wrong!"));
          }
            
    }
}