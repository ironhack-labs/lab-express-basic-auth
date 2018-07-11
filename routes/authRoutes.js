const express      = require('express');
const userRouter   = express.Router();
const User         = require('../models/user');
const bcrypt       = require('bcryptjs');


userRouter.get('/signup', (req, res, next)=>{

    res.render('userViews/signupPage');
})

userRouter.post('/signup', (req, res, next)=>{
    const thePassword = req.body.thePassword;
    const theUsername = req.body.theUsername;
    if(thePassword === "" || theUsername === ""){
        res.render('userViews/signupPage', {errorMessage: 'Please fill in both a username and password in order to create an account'})
        return;
    }
    User.findOne({'username': theUsername})
    .then((responseFromDB)=>{
        if (responseFromDB !== null){
            res.render('userViews/signupPage', {errorMessage: `Sorry, the username ${theUsername} is awesome, so you cant have it. Too late! Be a beta tester next time`})
            return;
        } // ends the if statement
            const salt     = bcrypt.genSaltSync(10);
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
    res.render('userViews/loginPage');
});

userRouter.post('/login', (req, res, next)=>{
    const theUsername = req.body.theUsername;
    const thePassword = req.body.thePassword;
    if (theUsername === "" || thePassword === "") {
        res.render("userViews/loginPage", {errorMessage: "Indicate a username and a password to sign up"});
        return;
      }
    User.findOne({ "username": theUsername }, (err, user) => {
        if (err || !user) {
          res.render("userViews/loginPage", {errorMessage: "Sorry, that username doesn't exist" });
          return;
        }
        if (bcrypt.compareSync(thePassword, user.password)) {
        //   console.log(req.session);
          req.session.currentUser = user;
          console.log(req.session.currentUser);
          //res.redirect("/");
          res.render("index", {theUser: req.session.currentUser});
        } else {
          res.render("userViews/loginPage", {errorMessage: "Incorrect password"});
        }
    }); 
});



userRouter.get("/logout", (req, res, next) => {
    req.session.destroy((err) => {
      
      res.redirect("/login");
    });
  });

  userRouter.get('/private', (req, res, next) => {
      //console.log(req.session);
      if(req.session.currentUser !== undefined)
        res.render('private');
      else
        res.render('userViews/loginPage', {errorMessage : "Need to log in"}); 
  })


  userRouter.get('/main', (req, res, next) => {
    //console.log(req.session);
    if(req.session.currentUser !== undefined)
      res.render('main');
    else
      res.render('userViews/loginPage', {errorMessage : "Need to log in"}); 
})

module.exports = userRouter;