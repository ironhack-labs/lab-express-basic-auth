const express 	   = require("express");
const bcrypt 	     = require("bcrypt");
const session      = require("express-session");
const mongoSession = require("connect-mongo")(session);
const router       = express.Router();

router.get('/signin',(req, res, next) => {
    res.render('signin');
});

module.exports = router;
