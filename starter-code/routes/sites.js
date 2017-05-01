/*jshint esversion: 6 */

const express = require('express');
const sitesR = express.Router();
const auth = require('../helpers/auth');

sitesR.get("/", (req, res, next) => {
  res.render("home");
});

sitesR.get("/main",auth.checkLoggedIn("/login"), (req, res, next) => {
  res.render("main");
});

sitesR.get("/private",auth.checkLoggedIn("/login"), (req, res, next) => {
  res.render("private");
});

module.exports = sitesR;
