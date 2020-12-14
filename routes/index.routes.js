const express = require('express');
const router = express.Router();
const {signUp,renderSignUp,renderSignIn,signIn,logout, userLogin,renderPrivate,renderMain} = require("../controllers/user.controllers")
/* GET home page */

router.get('/', (req, res, next) => res.render('index'))
.get("/sign-up",renderSignUp)
.post("/sign-up",signUp)
.get("/sign-in",renderSignIn)
.post("/sign-in",signIn)
.post("/logout",logout)
.get("/private",userLogin,renderPrivate)
.get("/main",userLogin,renderMain)

module.exports = router;
