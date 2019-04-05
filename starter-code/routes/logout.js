const mongoose = require ('mongoose');
const User = require ('../models/user');
const express = require('express');
const router = express.Router();


router.get("/", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});

module.exports=router;