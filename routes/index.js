const express = require('express')
const router = require("express").Router();
const User = require = require("../models/User.model")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
