
const express = require('express');
const router = require("express").Router();

const userRouter = require('./user.routes');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// User routes
router.use('/user', userRouter);

module.exports = router;
