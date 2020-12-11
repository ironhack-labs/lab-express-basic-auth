const express = require('express');
const router = express.Router();


const {
  signup,
  checkCredentials,
  signUpView,
} = require("../controllers/userController");


router
 .get('/', (req, res, next) => res.render('index'))
 .get("/signup", signUpView)
 .post("/signup",checkCredentials, signup);

module.exports = router;
