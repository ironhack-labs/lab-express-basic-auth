const router = require("express").Router();
const bcryptjs = require('bcryptjs')
const User = require('../models/User.model')
const loginCheck = require('./helperFunctions')





/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


// signup router

router.get("/signup", (req,res,next) => {
  res.render("signup")
})

router.post("/signup", (req,res,next) => {
  const {username, password} = req.body
  // hashing the password :0
  async function regUser() {
    try {

      // make the salt
      const salt = await bcryptjs.genSalt();
      // salt the pass
      const hashedPass = await bcryptjs.hash(password,salt);
      // call User model to create and save the user
      const newUser = await User.create({username, password:hashedPass});
      // redirect to wherever we want
      
      // HERE VERY COOL YOU CAN LOG IN IMMEDIATELY ON SIGNING UP :)
      req.session.user = newUser;
      res.redirect('/')
    }
    catch(err) {next(err)}
  }
  // cool function to have variable messages sent to the user depending on errors
  async function validateEntries() {
    const userFound = await User.findOne({username:username})
    let message = []
    if (userFound !== null) {
      message.push('Username already taken.')
    }
    if (password.length < 5) {
      message.push('Password is too short minimum is 6 characters')
    }
    if (message.length > 0) {
      console.log(userFound)
      res.render('signup', {message}) // try not redirect but render
    } else{
      regUser();
    }
  }
  validateEntries();
})

// logging in functionality

router.get("/login", (req,res,next) => {
  res.render("login")
})

router.post("/login", (req,res,next) => {
  const {username, password} = req.body;
  async function logIn() {
    try{
      const userToLog = await User.findOne({username:username});
      if (userToLog === null) {
        //username is incorrect therefore userToLog is null instead of user object
        res.render('login', {message:'Incorrect username'})
        return
      } else {
        //username is correct and we continue with session creation;
        if (bcryptjs.compareSync(password, userToLog.password)) {
          // req.session is the key we get from express-session
          // every route will pass through the session middleware because we put it in app.js
          // .user is important to remember: we put this var name, its not fixed
          req.session.user = userToLog;
          res.redirect('/profile')
        } else {
          res.render('login', {message: 'Incorrect password'})
          return
        }
      }
    }
    catch(err) {next(err)}
  }
    logIn();
})

router.get("/profile", loginCheck(), (req,res,next) => {
  // this will access the logged in user's username key
  // remember session.user - we put "user" its not fixed its a key we put there
  // this code should run ONLY if we have a user logged in so we create a middleware function
  // and we insert it between the URI we are catching and the function we declare :) 
  const username = req.session.user.username;
  res.render('profile', {username : username})
})

router.get("/logout", loginCheck(), (req,res,next) => {
  req.session.destroy();
  res.redirect('/')
})

module.exports = router

