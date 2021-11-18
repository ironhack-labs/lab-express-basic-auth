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
  if(!username || !password) return res.render("users/signup.hbs", {msg: "You need to fill all inputs"})
  try {
    //Encrypt password
    var hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await User.create({username, password: hashedPassword})
    res.render("users/signup.hbs", {justCreatedUser: createdUser.username})
  } catch (err){
    console.log(err)
    if (11000 === err.code || 11001 === err.code) {
      return res.render("users/signup.hbs", {msg: "User already exist"})
    }
  }
});

/* POST log in */
router.post("/login", async (req, res, next) => {
  const {username, password} = req.body;
  if(!username || !password) return res.render("users/login.hbs", {msg: "You need to fill all inputs"})
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

/* POST log out */
router.post("/logout", async (req, res, next) => {
  res.clearCookie('connect.sid', {path: '/'})
  try{
    await req.session.destroy()
    res.redirect('/')
  }catch(err){
    next(err);
  }
});

module.exports = router;
