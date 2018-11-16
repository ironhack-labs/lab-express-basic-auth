const express = require('express');
const router  = express.Router();
const User    = require('../models/User')


const genericUser = new User();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.post("/signUp", (req, res, next) => {
  const username = req.body.user;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("index", {
      errorMessage: "Indicate a username and a password to sign up"
    });
  return
}
  });
module.exports = router;
