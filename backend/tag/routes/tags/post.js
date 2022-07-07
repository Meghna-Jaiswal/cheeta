const { Response, BadRequestResponse } = require("../../lib/response");
const CheetahTags = require('../../models/Cheetah-tags');

module.exports = {
  saveTags: async (req, res, next) => {
    try {

        console.log("req body ::", req.body);

        if(!(req.body.tags && req.body.tags.length))
          return res
                  .status(400)
                  .json(new BadRequestResponse("Insufficient Data!"));
        
        
        let tags = [...req.body.tags];
        let tagsIdArr = [];

        // Check if tags are pre created
        console.log('finding for tags')
        for(let i=0 ; i<tags.length ; i++) {
          let found = await CheetahTags.findOne({tag: tags[i]});
          // console.log('found :',found )
          if(found) {
            tagsIdArr.push(found._id);
            tags[i] = "";
          }
        }

        console.log('found tagIds:',tagsIdArr, 'tagArr :', tags )

        // Removing pre created tags
        tags = tags.filter(t => {if(t !== "") return t;})

        // Save tag if not pre created
        console.log('saving tags', tags)
        for(let i=0 ; i<tags.length ; i++) {
          let resp = await CheetahTags.create({tag: tags[i]});

          console.log('Saved :', resp)

          if(resp) tagsIdArr.push(resp._id);
        }

        console.log("Tags result ::", tagsIdArr);

        return res.json({
                  status: {
                    code: 200,
                    message: "Successfully Created!"
                  },
                  data: {
                    tagsIdArr
                  }
              });
        

    } catch (e) {
      console.error(e);

      return res
        .status(400)
        .json(new BadRequestResponse("Something went wrong!"));
    }
  },



  getTagNames: async (req, res, next) => {
    try {

      console.log("req body ::", req.body);
      if(!(req.body.tagIds && req.body.tagIds.length))
          return res
                  .status(400)
                  .json(new BadRequestResponse("Insufficient Data!"));

      let result = await CheetahTags.find({_id: { $in: [...req.body.tagIds] } })

      let tagsNamesArr = [];
      
      if(result)
        result.forEach(i => tagsNamesArr.push(i.tag))

      console.log("Tags names ::", tagsNamesArr);

      return res.json({
                status: {
                  code: 200,
                  message: "Successfully Created!"
                },
                data: tagsNamesArr
            });
      

  } catch (e) {
    console.error(e);

    return res
      .status(400)
      .json(new BadRequestResponse("Something went wrong!"));
  }
  },


  getTagIds: async (req, res, next) => {
    try {

      console.log("req body ::", req.body);
      if(!(req.body.tags && req.body.tags.length))
          return res
                  .status(400)
                  .json(new BadRequestResponse("Insufficient Data!"));

      let tags = [];
      req.body.tags.filter(i => {
        tags.push(new RegExp(i,'g'));
      })

      console.log(tags)

      let result = await CheetahTags.find({tag: { $in: [...tags] } })

      let tagIdsArr = [];
      
      if(result)
        result.forEach(i => tagIdsArr.push(i._id))

      console.log("Tags names ::", tagIdsArr);

      return res.json({
                status: {
                  code: 200,
                  message: "Successfully Created!"
                },
                data: tagIdsArr
            });
      

  } catch (e) {
    console.error(e);

    return res
      .status(400)
      .json(new BadRequestResponse("Something went wrong!"));
  }
  },
};
