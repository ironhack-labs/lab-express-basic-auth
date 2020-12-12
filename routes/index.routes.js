const express = require('express');
const router = express.Router();


const {
  signup,
  checkCredentials,
  signUpView,
  login,
  logout,
  logInView,
  mainView,
  userSecureRoute,
  indexView,
} = require("../controllers/userController");


router
 .get("/", indexView)
 .get("/signup", signUpView)
 .get("/login", logInView)
 .get("/main",userSecureRoute, mainView)
 .post("/signup",checkCredentials, signup)
 .post("/login", login)
 .post("/logout", logout)
 

module.exports = router;
