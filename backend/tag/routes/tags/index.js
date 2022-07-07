let express = require('express');
let router = express.Router( {mergeParams: true} );
const checkAuth = require("../../middleware/check-auth");

const get = require('./get');
let post = require('./post');

//POST requests
router.post('/', checkAuth ,post.saveTags);


// POST to get Tag name by TagId
router.post('/getTagNames', checkAuth ,post.getTagNames);

// POST to get TagId by project names
router.post('/getTagIds', checkAuth ,post.getTagIds);


// Get requests

// get List of projects
router.get('/projectsList', get.projectsList);
router.get('/projectsWithIds', get.projectsWithIds);


//* Get for search with tags

module.exports = router;