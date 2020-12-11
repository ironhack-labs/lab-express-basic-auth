const express = require('express');
const router = express.Router();
const {signUp,renderSignUp,renderSignIn,signIn} = require("../controllers/user.controllers")
/* GET home page */

router.get('/', (req, res, next) => res.render('index'))
.get("/sign-up",renderSignUp)
.post("/sign-up",signUp)
.get("/sign-in",renderSignIn)
.post("/sign-in",signIn);

module.exports = router;
