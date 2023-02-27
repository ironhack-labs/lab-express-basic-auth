const express = require('express')
const exposeUserToView = require('../middlewares/exposeUserToView')
const router = require("express").Router();
1
/* GET home page */
router.get("/", exposeUserToView, (req, res, next) => {
  res.render("index")
});

router.use('/', require('./auth.routes'))
router.use('/', require('./user.routes'))

module.exports = router;
