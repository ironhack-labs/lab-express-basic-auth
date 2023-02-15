const router = require("express").Router();
const express = require("express");
const User = require("../models/User.model");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
