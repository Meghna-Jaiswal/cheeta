const getHrId = require('../lib/getHrId');


module.exports = async (req, count) => {
  if (
    req.body.title &&
    req.body.description &&
    req.body.priority
  ) {
    return {
      created: true,
      obj: {
        hrId: getHrId(count),
        user: {...req.body.user},
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority, // P0, P1, P2, P3
        projectName: "",
        type: req.body.type ? req.body.type : "", // Big or small
        state: req.body.state ? req.body.state : "backlog", // backlog, development, testing, done, deployed
        files: req.body.files ? [...req.body.files] : [],
        members: req.body.members ? [...req.body.members] : [],
        expectedTime: req.body.expectedTime ? req.body.expectedTime : "",
        realTimeTaken: "",
        UT: req.body.UT ? req.body.UT : false,
        documentation: req.body.documentation ? req.body.documentation : false,
        tags: [],
        comments: req.body.comments ? [...req.body.comments] : [],
        status: 0 // 0 = Open, 2 = Close, 3 = Deleted
      },
    };
  } else
    return {
      created: false,
      obj: {},
    };
};
