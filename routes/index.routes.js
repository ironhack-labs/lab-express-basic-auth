const express = require('express');
const router = express.Router();
const {signUp, addUser, logIn, logUserIn, checkUserCredentials, logOut, getTheCat, getTheGif } = require("../controllers/auth.controller")

/* GET home page */
router.get('/', (req, res, next) => res.render('index'))
    .get("/signup", signUp)
    .post("/signup", checkUserCredentials, addUser)
    .get("/login", logIn)
    .post("/login", logUserIn)
    .get("/logout", logOut)
    .get("/main", getTheCat)
    .get("/private", getTheGif )

module.exports = router;
