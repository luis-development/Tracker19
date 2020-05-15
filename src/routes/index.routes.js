const express = require('express');
const router = express.Router();

//requires
const { indexpage, allTrackesRender, addTracker, addnew } = require('../controllers/index.controller');
const { isAuthenticated } = require("../helpers/auth");

// Get principal page
router.get('/', indexpage);

// more pages
router.get('/allTrackes', isAuthenticated, allTrackesRender);

// add trackes
router.get('/addTracker', isAuthenticated, addTracker);

router.post('/addTracker-addnew', addnew);

module.exports = router;