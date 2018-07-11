const express = require('express');
const userRouter = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

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

userRouter.get('/login', (req, res, next)=>{
    res.render('userViews/loginPage')
})

userRouter.get('/main',(req, res, next)=>{
        const data = {};
        if(req.session.currentUser){
          data.theUser = req.session.currentUser;
        }
        res.render('main', data);
      });

userRouter.get('/private',(req, res, next)=>{
  const data = {};
  if(req.session.currentUser){
    data.theUser = req.session.currentUser;
  }
  res.render('private', data);
});
      
      
userRouter.post('/login', (req, res, next)=>{
    const theUsername = req.body.theUsername;
    const thePassword = req.body.thePassword;
    
    
    if(theUsername === "" || thePassword === ""){
        res.render("userViews/loginPage", {errorMessage: "Indicate a username and password"})
        return;
    }
    User.findOne({"username": theUsername}, (err, user)=>{
        if(err || !user){
            res.render("userViews/loginPage", {errorMessage: "Sorry, that username doesnt exist"})
            return;
        }
        if(bcrypt.compareSync(thePassword, user.password)) {
            req.session.currentUser = user;
            res.redirect('/main')
        } else {
            res.render('userViews/loginPage', {errorMessage: "Incorrect Password"})
        }
    })
});

userRouter.get('/logout', (req, res, next)=>{
    req.session.destroy((err)=>{
        res.redirect("/login")
    })
});


module.exports = userRouter;