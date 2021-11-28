const router = require("express").Router();
const User = require("../models/User.model")
const bcryptjs = require("bcryptjs")
const {isLoggedIn, isLoggedOut} = require("../middleware/route.guard.js")

router.get("/login", isLoggedOut, (req, res, next) => {
    res.render("login");
  });
  router.get("/signup", isLoggedOut, (req, res, next) => {
    res.render("signup");
  });
  router.get("/private", isLoggedIn, (req, res, next) => {
    const userData = req.session.currentUser
    res.render("private", {userData});
  });
  
  router.post("/signup", async (req, res, next) => {
    const {username, password} = req.body
    
    // hashing password
    const saltRounds = 10
    try {
      const salt = await bcryptjs.genSalt(saltRounds)
      hashedPasswort = await bcryptjs.hash(password, salt)    
    } catch (error) {
      console.log(error);
    }
  
    //create user with hashed password
    try {
      await User.create({"username": username, "password": hashedPasswort})
      res.render("login");
    } catch (error) {
      console.log(error);
      res.redirect("/signup");
    }
  });
  
  router.post("/login", async (req, res, next) => {
    const {username, password} = req.body

    console.log("Session--->", req.session);
  
    // verify password
    try {
      const foundUser = await User.findOne({"username": username})
      const verified = await bcryptjs.compare(password, foundUser.password)
      
      if (verified){
        // res.render("private", {foundUser});
        req.session.currentUser = foundUser.username
        console.log(req.session.currentUser)
        res.redirect("/private")
      }
      else {
        res.render("login");
      }
    } catch (error) {
      console.log(error);
      res.redirect("/login");
    }
  });

  router.post("/logout", (req, res, next) => {
    req.session.destroy(err => {
      res.redirect("/")
    })
  })

  module.exports = router;