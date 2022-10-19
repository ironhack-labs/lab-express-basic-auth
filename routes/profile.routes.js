const express = require("express");
const router = express.Router();
const User = require("../models/User.model.js");
const bcryptjs = require("bcryptjs");

//GET 'auth/signup'
router.get("/", async (req, res, next) => {
  try {
   let newUser = await User.findById(req.session.activeUser._id);
   res.render('profile/my-profile.hbs',{
    details:newUser
   })
  } catch (error) {
    next(error);
  }
});

module.exports = router;
