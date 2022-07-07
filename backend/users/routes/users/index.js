let express = require('express');
let router = express.Router( {mergeParams: true} );
const checkAuth = require("../../middleware/check-auth");

const get = require('./get');
const post = require('./post');
const put = require('./put');
const del = require('./delete');


// GET requests
router.get('/getUsersList', checkAuth, get.getUsersList);
router.get('/getScores', checkAuth, get.getScores);
router.get('/telegram/:id', checkAuth, get.getUserFromTelegram);
router.get('/:id', checkAuth, get.getUserInfo);

//POST requests
router.post('/newPassword', post.newPassword);
router.post('/forgetPassword', post.forgetPassword);
router.post('/verifyOTP', post.verifyOTP);
router.post('/login', post.login);
router.post('/', post.register);

// PUT requests
router.put('/scoreChange', checkAuth, put.scoreChange);
router.put('/:id', checkAuth, put.updateProfile);

// DELETE requests
router.delete('/:id', checkAuth, del.deleteUser);


module.exports = router;




// Don't make change before asking Himanshu