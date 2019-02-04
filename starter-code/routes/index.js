// routes/auth-routes.js
const express = require("express");
const authRoutes = express.Router();

// User model
const User = require("../models/user");

/* GET home page */
authRoutes.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = authRoutes;
