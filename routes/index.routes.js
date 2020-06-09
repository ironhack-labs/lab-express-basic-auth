// Requiring express and definig the router variable
const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

// Export the index route
module.exports = router;