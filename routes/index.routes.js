const express = require('express');
const router = express.Router();
const {signUp, addUser, logIn, logUserIn, checkUserCredentials} = require("../controllers/auth.controller")

/* GET home page */
router.get('/', (req, res, next) => res.render('index'))
    .get("/signup", signUp)
    .post("/signup", checkUserCredentials, addUser)
    .get("/login", logIn)
    .post("/login", logUserIn)

module.exports = router;
