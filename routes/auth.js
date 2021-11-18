const router = require("express").Router();
const bcrypt = require('bcryptjs');

// Model
const User = require("../models/User.model")

/* GET sign up */
router.get("/signup", (req, res, next) => {
  res.render("users/signup.hbs");
});

/* GET log in */
router.get("/login", (req, res, next) => {
  res.render("users/login.hbs");
});


/* POST sign up */
router.post("/signup", async (req, res, next) => {
  const {username, password} = req.body;
  try {
    //Encrypt password
    var hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await User.create({username, password: hashedPassword})
    res.render("users/signup.hbs", {justCreatedUser: createdUser.username})
  } catch (err){
    console.log(err)
  }
});

/* POST sign up */
router.post("/login", async (req, res, next) => {
  const {username, password} = req.body;
  if(!username || !password) res.render("users/login.hbs", {msg: "You need to fill all inputs"})
  try {
    const userFromDB = await User.findOne({username})
    if(!userFromDB){ 
      res.render("users/login.hbs", {msg: "The user does not exist"})
    } else { 
      const passwordsMatch = await bcrypt.compare(password, userFromDB.password)
      if(!passwordsMatch){
        res.render("users/login.hbs", {msg: "Incorrect password"})
      } else {
        req.session.loggedUser = userFromDB
        console.log('Session =======>  ', req.session)
        res.render("users/login.hbs", {msg: "Log in correct!"})
        // res.redirect(`/users/profile`)
      }
    }
  } catch (err){
    console.log(err)
  }
});

module.exports = router;
