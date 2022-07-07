let express = require('express');
let router = express.Router( {mergeParams: true} );
const checkAuth = require("../../middleware/check-auth");

const get = require('./get');
const post = require('./post');
const del = require('./delete');


// GET requests
router.get('/:userId', checkAuth, get.getUserOKR);

//POST requests
router.post('/', checkAuth, post.createOKR);


// DELETE requests
router.delete('/:id', checkAuth, del.deleteOKR);



// Experiment
router.post('/abc', (req, res) => {
    console.log('req ::::: \n', req);
    console.log('REq headers :::: \n', req.headers);
    console.log('req.body :::: \n ', req.body);

    res.send('ABCD');
})


module.exports = router;