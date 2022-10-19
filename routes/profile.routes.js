const express = require("express");
const router = express.Router();
const User = require("../models/User.model.js");
const bcryptjs = require("bcryptjs");
const {isLogged} = require ('../middlewares/auth.js');


// GET 'auth/signup'
router.get("/", isLogged, async (req, res, next) => {
  try {
   let newUser = await User.findById(req.session.activeUser._id);
   res.render('profile/main.hbs',{
    details:newUser
   })
  } catch (error) {
    next(error);
  }
});

router.get('/private', isLogged, async (req,res,next) => {
  try {
    res.render('profile/private.hbs')
    
  } catch (error) {
    next(error)
    
  }
})


module.exports = router;
