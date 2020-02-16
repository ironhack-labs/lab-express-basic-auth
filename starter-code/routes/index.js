const express = require('express');
const router  = express.Router();
const User = require('../models/User')
const authRouter = require('./auth')
const loginRouter = require('./login')
const siteRouter = require("./site-routes");

//Route for auth
router.use("/signup", authRouter);

//Route for login
router.use("/login", loginRouter);

// Protected pages
router.use("/", siteRouter);

// LOGOUT user
router.get ('/logout', (req, res, next) => {
  req.session.destroy ( (err) => {
    if (err) {
      res.redirect('/');
    } else {
      res.redirect('/login')
    }
  })
})

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
