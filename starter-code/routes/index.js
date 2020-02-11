const express = require('express');
const router  = express.Router();
const User = require('../models/User')
const authRouter = require('./auth')
const loginRouter = require('./login')

//Route for auth
router.use("/signup", authRouter);

//Route for login
router.use("/login", loginRouter);

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
