
const formatMessage = require("../../lib/massageFormat");
const { Response, BadRequestResponse } = require("../../lib/response");
const { saveTags, getTagNames, getTagIds } = require("../../lib/tags");
const TelegramNotification = require("../../lib/telegram_notification");
const CheetaTask = require('../../models/cheetaTask');
const CheetaTicket = require('../../models/cheetaTicket');
const ticketObjCreator = require('../../objects/cheetaTicket');

module.exports = {

  createTicket: async (req, res, next) => {
    try {

      console.log('Creating Ticket :: ', req.userData, "\n", req.body);

      let ticketObj = await ticketObjCreator(req, await CheetaTicket.countDocuments());

      // if not sufficient info send response fields missing
      if(!ticketObj.created) 
          return res.status(400).json({
              status: {
                  code: 400,
                  message: "Insufficient info!"
              }
          })

      console.log(ticketObj)
      // save in db
      let result = await CheetaTicket.create(ticketObj.obj);

      if(result && req.body.tags && req.body.tags.length) {
        try {
          let tagId = await saveTags(req, {
            tags: [...req.body.tags],
            ticketId: result._id
          })
          console.log('here', tagId)
          
          if(tagId) {
            result = await CheetaTicket.findOneAndUpdate({_id: result._id}, 
                                      {$push: {tags: tagId}}, {new: true, useFindAndModify: false})
          }

        }catch(err) {
          console.log(err);

          // Send mail to admin
        }
      }
      
      res.json({
        status: {
          code: 200,
          message: "Ticket Created Successfully!"
        },
        data: result      // Send response to users
      })
      
      console.log('TelegramNotification', result)
      if(result) {
        const message = await new formatMessage(result).createTicket()
        await new TelegramNotification(result.members, message).init()
      }
      return

    } catch (e) {
      console.error(e);

      return res
        .status(400)
        .json({
          status: {
            code: 400,
            message: "Something went wrong!"
          },
          error: e
        });
    }


  },



  createTask: async (req, res, next) => {
    try {

      console.log('Creating Task :: ', req.userData, '\n', req.body);

      let setDate = new Date();
      setDate.setDate(setDate.getDate() - 1);

      let taskObj = {
        userId: req.userData.userId,
        date: setDate,
        bigTasks: [...req.body.bigTasks],
        smallTasks: [...req.body.smallTasks]
      }

      
      const result = await CheetaTask.create(taskObj);
      console.log(result);

      return res.json({
            status: {
                message: "Tasks Stored Successfully!",
                code: 200,
            },
            data: result
        }); 

    } catch (e) {
      console.error(e);

      return res
        .status(400)
        .json(new BadRequestResponse("Something went wrong!"));
    }
  },



  getTickets: async (req, res, next) => {
    try {
        console.log("Getting tickets ::", req.body);

        let search = {
          status: { $in: [0, 1] }
        };

        if(req.body.project) {
          // get tagsIds based on project names
          // let result = await getTagIds(req, [...req.body.project]);
          // console.log('tagId rresult ::', result);
          // search['tags'] = { "$in" : [...result] }
          
          search['tags'] = { "$in" : [...req.body.project] }
        }

        if(req.body.members) {
            search['members'] =  { $elemMatch: { userId: { $in: [...req.body.members] } } }
        }

        if(req.body.priority) {
          let lowerCaseArr = [];
          for(let i=0 ; i<req.body.priority.length ; i++) {
            lowerCaseArr.push(req.body.priority[i].toLowerCase())
          }
          search['priority'] = { "$in" : [...req.body.priority, ...lowerCaseArr] }
        }

        if(req.body.state){
          search['state'] = req.body.state
        }

        console.log('Search obj :: ', search);

        let results = await CheetaTicket.find(search);

        if(results)
          results = await getTagNames(req, results);

        // Do not send those ticket which are in done||deployed state and older than 1 month
        const oneMonthOldDate = new Date(new Date().setMonth(new Date().getMonth() - 1));

        results = results.filter((a)=> {
          if(
            !((a.state == 'done' || a.state == 'deployed') &&
            new Date(a.updatedAt) < oneMonthOldDate)
          ) return a;
        })

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
};