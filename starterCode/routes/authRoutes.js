const express = require('express');
const userRouter  = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

//GET SIGNUP PAGE
userRouter.get('/authRoutes/signup', (req, res, nex) => {
  res.render('authViews/signupPage');
})

//POST SIGNUP INFO
userRouter.post('/authRoutes/signup', (req, res, nex) => {
  const thePassword = req.body.thePassword;
  const theUsername = req.body.theUsername;
  if (theUsername === "" || thePassword === "") {
    res.render('authViews/signupPage', { errorMessage: "Indicate a username and a password to sign up" });
    return;
  }
  User.findOne({ 'username': theUsername })
    .then((responseFromBD) => {
      console.log(responseFromBD);
      if (responseFromBD !== null) {
        res.render('authViews/signupPage', { errorMessage: `Sorry ${theUsername} is taken` });
        return;
      } //ends the if statement
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(thePassword, salt);
      User.create({ username: theUsername, password: hashedPassword })
        .then((response) => {
          res.redirect('/');
        })
        .catch((err) => {
          next(err);
        })
    }) //end the .then form the user.findone
}) //ends the route


//GET LOGIN PAGE
userRouter.get('/authRoutes/login',(req,res,next)=>{
  res.render('authViews/loginPage');
})


//POST LOGIN INFO
userRouter.post('/authRoutes/login',(req,res,next)=>{
  const theUsername = req.body.theUsername;
  const thePassword = req.body.thePassword;
  
  if (theUsername === "" || thePassword === "") {
    res.render('authViews/loginPage', {errorMessage: "Indicate a username and a password to sign up"});
    return;
  }

  User.findOne({ "username": theUsername }, (err, user) => {
    if (err || !user) {
      res.render('authViews/loginPage', {errorMessage: "The username doesn't exist"});
      return;
    }
    if (bcrypt.compareSync(thePassword, user.password)) {
      // Save the login in the session!
      req.session.currentUser = user;
      res.redirect("/");
    } else {
      res.render('authViews/loginPage', {
        errorMessage: "Incorrect password"
      });
    }
});
})

//LOGOUT
userRouter.get('/authRoutes/logout',(req,res,next)=>{
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/authRoutes/login");
  });
});

module.exports = userRouter;
