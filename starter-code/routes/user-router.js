const express= require('express');
const mongoose= require('mongoose');
const bcrypt= require('bcrypt');


const router= express.Router();
const UserModel= require('../models/user-model');


//step 1
router.get('/signup',(req,res,next)=>{

  res.render('user-views/signup-page');
});

//step 2
router.post('/process-signup',(req,res,next)=>{

  if(req.body.signupPassword === ""|| req.body.signupPassword.length < 6 || req.body.signupPassword.match(/[^a-z0-9]/i)===null)
  {
    res.locals.errorMessage= "password is invalid";
    res.render("user-views/signup-page");
    //early return
    return;
  }
  //finds if email is taken, query the database
  UserModel.findOne({userName: req.body.signupUserName})
  .then((userFromDb)=>{
    if(userFromDb !==null)
    {
      res.locals.errorMessage= "username is invalid";
      res.render("user-views/signup-page");
      return;
    }
    //generate salt
    const salt= bcrypt.genSaltSync(10);

    //encrypt the password submitted from teh form
    const scrambledPassword= bcrypt.hashSync(req.body.signupPassword,salt);

    //create a new user

    const theUser= new UserModel({
      userName:req.body.signupUserName,

      encyptedPassword:req.body.signupPassword,

    });
    //return the promise of the next database query
    return theUser.save();
  })

    .then(()=>{
      res.redirect("/");

    })
    .catch((err)=>{
      next(err);
    });


});





module.exports = router;
