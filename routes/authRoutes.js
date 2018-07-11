const express     = require('express');
const userRouter  = express.Router();
const User        = require('../models/User');
const bcrypt      = require('bcryptjs');





userRouter.get("/signup", (req, res, next)=>{
  res.render("userViews/signupPage");
});

userRouter.post("/signup", (req, res, next)=>{
  const thePassword = req.body.thePassword;
  const theUsername = req.body.theUsername;
  if(thePassword === "" || theUsername === ""){
    res.render('userViews/signupPage', {errorMessage: "Please fill in both a username and password to proceed."});
    return;
  }

  User.findOne({'username': theUsername})
  .then((response)=>{
    if(response !== null){
      res.render('userViews/signupPage', {errorMessage: `Sorry ${theUsername} is taken, please select another name.`});
      return;
    } //ends IF statement

    const salt        = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(thePassword, salt);

    //now we create users/password objects
    User.create({username: theUsername, password: hashedPassword})
    .then((response)=>{
      console.log("---------------------------------------------");
      res.redirect('/');
    })
    .catch((err)=>{
      next(err);
    });

  });
});

userRouter.get('/login', (req, res, next)=>{
  res.render("userViews/loginPage");
});

userRouter.post('/login', (req, res, next)=>{
  const theUsername = req.body.theUsername;
  const thePassword = req.body.thePassword;
  if( theUsername === "" || thePassword === ""){
    res.render('userViews/loginPage', {errorMessage: "You need a username or password to login"});
    return;
  }
  User.findOne({"username": theUsername}, (err, user) =>{
    if (err || !user){
      res.render("userViews/loginPage", {errorMessage: "sorry that user name does not exist."});
      return;
    }
    if(bcrypt.compareSync(thePassword, user.password)){
      req.session.currentUser = user;
      res.redirect("/");
    } else {
      res.render("userViews/loginPage", {errorMessage: "Incorrect Password Entered"});
    }
  });
});

userRouter.use((req, res, next)=>{
  if(req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
});

userRouter.get('/main', (req, res, next)=>{
  res.render("userViews/mainPage");
});


userRouter.get('/private', (req, res, next)=>{
  res.render('userViews/privatePage');
});

userRouter.get('/logout', (req, res, next)=>{
  req.session.destroy((err)=>{
    res.redirect("/login");
  });
});

module.exports = userRouter;
