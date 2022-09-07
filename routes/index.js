const router = require("express").Router();
const bcryptjs = require('bcryptjs')
const User = require('../models/User.model')


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
    
    // make the salt
    const salt = await bcryptjs.genSalt();
    // salt the pass
    const hashedPass = await bcryptjs.hash(password,salt);
    // call User model to create and save the user
    const newUser = await User.create({username, password:hashedPass});
    // redirect to wherever we want
    res.redirect('/')
  }
  // async function validateEntries() {
  //   const userFound = await User.findOne({username:username})
  //   let message = ""
  //   if (userFound !== undefined) {
  //     message.push('Username already taken.')
  //   }
  //   if (password.length < 5) {
  //     message.push('Password too short, must be at least 6 characters.')
  //   }
  //   if (message.length > 0) {
  //     res.redirect("/signup/") // try not redirect but render
  //   } else{
  //     regUser();
  //   }
  // }
  regUser();
})

// logging in functionality

router.get("/login", (req,res,next) => {
  res.render("login")
})

router.post("/login", (req,res,next) => {
  const {username, password} = req.body;
  async function logIn() {
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
  logIn();
})

module.exports = router;
