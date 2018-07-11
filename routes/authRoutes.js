const express       = require('express')
const userRouter    = express.Router();
const User          = require('../models/user');
const bcrypt        = require('bcryptjs');


userRouter.get('/signup', (req, res, next)=>{
    res.render('userViews/signupPage');
})

userRouter.post('/signup', (req, res, next)=>{
//create a salt
//hash it
const thePassword = req.body.thePassword;
const theUsername = req.body.theUsername;
if(thePassword ==="" || theUsername===""){
    res.render('userViews/signupPage', {errorMessage: 'Please fill in both the username and the password fields'});
    return;
}
User.findOne({'username': theUsername})
.then((responseFromDB)=>{

    if (responseFromDB !== null){
        res.render('userViews/signupPage', {
            errorMessage: `Sorry, the username ${theUsername} is taken`})
        return;
    }

    const salt     = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(thePassword, salt);
    // res.send(req.body);
    User.create({username: theUsername, password: hashedPassword})
    .then((response)=>{
        res.redirect('/');
    })
    .catch((err)=>{
        next(err)
    })
})
})

userRouter.get('/login', (req, res, next)=>{
    res.render('userViews/loginPage');
})
////////
userRouter.post('/login', (req, res, next)=>{
const theUsername = req.body.theUsername
const thePassword = req.body.thePassword;
if (theUsername === "" || thePassword === "") {
    res.render("userViews/loginPage", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": theUsername }, (err, user) => {
      if (err || !user) {
        res.render("userViews/loginPage", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        //this is a way to find the current users object stuff, like
        //req.session.currentUser.username
        res.redirect("/");
      } else {
        res.render("userViews/loginPage", {
          errorMessage: "Incorrect password"
        });
      }
  }); //this ends the callback function that runs after then user.findone

})
module.exports = userRouter;
