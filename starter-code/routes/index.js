const express = require('express');
const router  = express.Router();
const auth = require('./auth');
const site = require("./sites");

/* GET home page */
// router.get('/', (req, res, next) => {
//   res.render('index');
// });


router.use('/', auth);
router.use('/', site);

module.exports = router;
