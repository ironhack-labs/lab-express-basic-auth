const express     = require('express');
const userRouter  = express.Router();
const User        = require('../models/userModel');
const bcrypt      = require('bcryptjs');
const ensureLogin = require('connect-ensure-login');
const passport    = require('passport');

userRouter.get('/signup', (req, res, next)=>{
    res.render('signupPage')
});

userRouter.post('/signup', (req, res, next)=>{
    const thePassword = req.body.thePassword;
    const theUsername = req.body.theUsername;

if(thePassword ==="" || theUsername===""){
    res.render('signupPage', {errorMessage: "Please fill in both the username and password to create an account"})
return;
}

User.findOne({'username': theUsername})
.then((theUser)=>{
    if (theUser !== null){
        res.render('/signupPage', 
        {errorMessage: "Sorry, that username is already taken."})
        return;
    }

const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(thePassword, salt);

User.create({username: theUsername, password: hashedPassword})
.then((response)=>{
    res.redirect('/')
})
.catch((err)=>{
    next(err);
})
})
});




userRouter.get('/main', ensureLogin.ensureLoggedIn(),(req, res, next) => {
    res.render('main', {theUser: req.user });
  });

  userRouter.get('/private', ensureLogin.ensureLoggedIn(),(req, res, next) => {
    res.render('private', {theUser: req.user });
  });

  userRouter.get('/login', (req, res, next)=>{
    res.render('loginPage', { "message": req.flash("error") })
})

userRouter.post('/login', passport.authenticate("local", {
    successRedirect: "/main",
    failureRedirect: "/login",
    failureFlash: true,
    passReqCallback: true
}));

userRouter.get("/logout", (req, res, next)=>{
    req.logout();
          res.redirect("/login")
  });


module.exports = userRouter;