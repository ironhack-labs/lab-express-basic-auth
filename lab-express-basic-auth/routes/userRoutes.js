const express     = require('express');
const userRouter  = express.Router();
const User        = require('../models/user');
const bcrypt      = require('bcryptjs');
const ensureLogin = require('connect-ensure-login');
const passport    = require('passport');

userRouter.get('/signup', (req, res, next)=>{
    res.render('userViews/signupPage');
})

userRouter.post('/signup', (req, res, next)=>{
    const thePassword = req.body.thePassword;
    const theUsername = req.body.theUsername;
    
    if(thePassword === "" || theUsername === ""){
        res.render('userViews/signupPage', {errorMessage: "User did not fill out the form properly"})
        return;
    }

    User.findOne({'username': theUsername})
    .then((responseFromDB)=>{
        if(responseFromDB !== null){
            res.render('userViews/signupPage',{errorMessage: `Sorry the username ${theUsername} is already taken`})
            return;
        }
   
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(thePassword, salt);

    User.create({username: theUsername, password: hashedPassword})
    .then((response)=>{
        res.redirect('/');
    })
    .catch((err)=>{
        next(err);
    }) 
})

});

userRouter.post('/signup', (req, res, next)=>{
    const thePassword = req.body.thePassword;
    const theUsername = req.body.theUsername;
    
    if(thePassword === "" || theUsername === ""){
        res.render('userViews/signupPage', {errorMessage: "User did not fill out the form properly"})
        return;
    }

    User.findOne({'username': theUsername})
    .then((responseFromDB)=>{
        if(responseFromDB !== null){
            res.render('userViews/signupPage',{errorMessage: `Sorry the username ${theUsername} is already in use`})
            return;
        }
   
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(thePassword, salt);

    User.create({username: theUsername, password: hashedPassword})
    .then((response)=>{
        res.redirect('/');
    })
    .catch((err)=>{
        next(err);
    }) 
})

});

userRouter.get('/main', ensureLogin.ensureLoggedIn(), (req, res, next)=>{
        
         res.render('main', {theUser: req.user});
});

userRouter.get('/private',ensureLogin.ensureLoggedIn(), (req, res, next)=>{
  
        res.render('private', {theUser: req.user});
});

userRouter.get('/login', (req, res, next)=>{
    res.render('userViews/loginPage', {"message": req.flash("error")})
})
      
userRouter.post('/login', passport.authenticate("local",{
    successRedirect: "/main",
    failureRedirect: "/login",
    failureFlash: true,
    passReqCallback: true
}));
    
userRouter.get('/logout', (req, res, next)=>{
    req.logout();
        res.redirect("/login")
});

module.exports = userRouter;