const express = require('express');
const router = express.Router( {mergeParams: true} );
const checkAuth = require("../../middleware/check-auth");

const post = require('./post');
const put = require('./put');
const get = require('./get');
const del = require('./delete');


//POST requests
router.post('/createTicket', checkAuth, post.createTicket);
router.post('/createTask', checkAuth, post.createTask);

// to get tickets based on filters
router.post('/getTickets', checkAuth, post.getTickets);

// PUT requests
router.put('/updateTicket/:id', checkAuth, put.updateTicket);
router.put('/changeTicketState/:id', checkAuth, put.newChangeTicketState);
// router.put('/changeTicketState/:id', checkAuth, put.changeTicketState);


// GET requests
router.get('/search', checkAuth, get.search);
router.get('/getAllTickets', checkAuth, get.getAllTickets);

// router.get('/getTicketSummary', checkAuth, get.getTicketSummary);
router.get('/getTicketSummary', get.getTicketSummary);

// Delete requests
router.delete('/deleteTicket/:id', checkAuth, del.deleteTicket);



module.exports = router;