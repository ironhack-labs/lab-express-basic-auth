const express = require('express');
const router  = express.Router();
const User = require("../models/User")
const { hashPassword, checkHashed } = require("../lib/hash");
const { isLoggedOut, isLoggedIn } =require("../lib/isLoggedMiddleware")
/* GET home page */
router.get('/register', isLoggedOut(), (req, res, next) => {
  res.render('auth/register');
});

router.post('/register', isLoggedOut(), async (req, res, next ) => {
  const {username, password} = req.body;
  if ( username === "" || password === "" ) {
    return res.render("auth/register", {errorMessage: "Indicate an username and password to signup"})
  } else {
    try {
      const existingUser = await User.findOne({username});
      if (!existingUser) {
        const newUser = await User.create({
          username,
          password: hashPassword(password)
        })
        return res.redirect("/");
      } else {
        return res.render("auth/register", { errorMessage: "The user already exists"}) 
      }
    } catch (e) {
      next(e)
    }
  }
});

router.get("/login",isLoggedOut(), (req,res,next) => {
  res.render("auth/login")
})

router.post('/login',isLoggedOut(), async (req, res, next ) => {
  const {username, password} = req.body;
  if ( username === "" || password === "" ) {
    return res.render("auth/login", {errorMessage: "Indicate an username and password to login"})
  } else {
    try {
      const existingUser = await User.findOne({username});
      if (!existingUser) {
        
        return res.render("/auth/login", {errorMessage: 'The username doesn`t exist'});
      } else {
        if (!checkHashed(password, existingUser.password)) {
          return res.render("auth/login", { errorMessage: 'Password missmatch'}) 
        } else {
          req.session.currentUser = existingUser
          return res.redirect("/")
        }
      }
    } catch (e) {
      next(e)
    }
  }
});

router.get("/logout", isLoggedIn(), async (req, res, next) => {
  req.session.currentUser = null;
  return res.redirect("/");
});

module.exports = router;

