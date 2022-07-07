
const { Response, BadRequestResponse } = require("../../lib/response");
const CheetaOKR = require('../../models/okr');
const okrObjCreator = require('../../objects/cheetaOkr');

module.exports = {
  createOKR: async (req, res, next) => {
      
      try {
        console.log('Create OKR \n body::', req.body);

        // check if every fields are there
        // create object for OKR
        let okrObj = okrObjCreator(req);

        // if not sufficient info send response fields missing
        if(!okrObj.created) 
            return res.status(400).json({
                status: {
                    code: 400,
                    message: "Insufficient info!"
                }
            })


        console.log(okrObj);

        // save in db
        const resp = await CheetaOKR.create(okrObj.obj);

        return res.json({
            status: {
                code: 200,
                message: "Successfully Registered!"
            },
            data: resp
        })

    } catch(error) {
        console.log(error);

        return res.status(400).json({
            status: {
                code: 400,
                message: "Something went wrong!",
                error
            }
        })
    }
  },
};