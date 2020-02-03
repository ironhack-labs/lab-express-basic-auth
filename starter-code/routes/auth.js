const express = require('express');
const router  = express.Router();
const User = require("../models/User")
const { hashPassword, checkHashed } = require("../lib/hash");

/* GET home page */
router.get('/register', (req, res, next) => {
  res.render('auth/register');
});

router.post('/register', async (req, res, next ) => {
  const {username, password} = req.body;
  try {
    const existingUser = await User.findOne({username});
    if (!existingUser) {
      const newUser = await User.create({
        username,
        password: hashPassword(password)
      })
      return res.redirect("/");
    } else {
      res.render("auth/register", { errorMessage: "The user already exists"}) 
    }
  } catch (e) {
    next(e)
  }
});

module.exports = router;