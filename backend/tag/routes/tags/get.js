const { Response, BadRequestResponse } = require("../../lib/response");
const CheetahTags = require('../../models/Cheetah-tags');


module.exports = {
    projectsList: async(req, res, next) => {
        try {
      
            let result = await CheetahTags.find({tag: { $in: [/P:/g] } })
      
            let projectsList = [];
            
            if(result)
              result.forEach(i => projectsList.push(i.tag.split(':').pop()))
      
            console.log("Tags names ::", projectsList);
      
            return res.json({
                      status: {
                        code: 200,
                        message: "Successfully Created!"
                      },
                      data: projectsList
                  });
            
      
        } catch (e) {
          console.error(e);
      
          return res
            .status(400)
            .json(new BadRequestResponse("Something went wrong!"));
        }

    },

    projectsWithIds: async(req, res, next) => {
      try {
    
          let result = await CheetahTags.find({tag: { $in: [/P:/g] } })
    
          let projectsList = [];
          
          if(result)
            result.forEach(i => projectsList.push({
                name: i.tag.split(':').pop(),
                id: i._id
              })
            )
    
          console.log("Tags names ::", projectsList);
    
          return res.json({
                    status: {
                      code: 200,
                      message: "Successfully Created!"
                    },
                    data: projectsList
                });
          
    
      } catch (e) {
        console.error(e);
    
        return res
          .status(400)
          .json(new BadRequestResponse("Something went wrong!"));
      }

  },
}