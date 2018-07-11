const express    = require('express');
const userRouter = express.Router();
const User       = require('../models/userModel');
const bcrypt     = require('bcryptjs');

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

userRouter.get('/login', (req, res, next)=>{
    res.render('loginPage')
})

userRouter.get('/main', (req, res, next)=>{
    res.render('main');
})

userRouter.get('/private', (req, res, next)=>{
    res.render('private');
})

userRouter.post('/login', (req, res, next)=> {
    const theUsername = req.body.theUsername;
    const thePassword = req.body.thePassword;

    if (theUsername ==="" || thePassword === ""){
        res.render("loginPage", {errorMessage: "Please indicate your username and password"});
    return;
    }
    User.findOne({ "username": theUsername }, (err, user) => {
        if (err || !user) {
          res.render("loginPage", {errorMessage: "Sorry, That username doesn't exist"});
          return;
        }
        if (bcrypt.compareSync(thePassword, user.password)) {
          req.session.currentUser = user;
          res.redirect("/main");
        } else {
          res.render("loginPage", {errorMessage: "Sorry, that password is incorrect"});
        }
    });
  });


module.exports = userRouter;