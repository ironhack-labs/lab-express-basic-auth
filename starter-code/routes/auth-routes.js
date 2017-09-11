const express = require('express');
const authRoutes = express.Router();
const User = require('../models/User');

authRoutes.get("/", (req, res, next)=>{
  res.render("auth/signup");
})

module.exports = authRoutes;
