const express = require('express');
const router = express.Router();

//get signup

router.get('/', (req,res,next) => res.render('signup'));

module.exports = router;
