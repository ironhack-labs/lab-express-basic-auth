const router = require('express').Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require("../models/User.model")

/* INTERATION 1 */

router.get("/signup", async (req, res, next) => {
    res.render("auth/signup")
})

router.post("/signup", async (req, res, next) => {
    const {username, password} = req.body
    try {
        if (!username || !password) {
            res.render('auth/signup', {
              errorMessage: 'Please create a username and password',
            });
            return;
          }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res.status(500).render('auth/signup', {
        errorMessage:
          'Invalid password, please create a password with 6 characters and include an uppercase and lowercase character',
      })
    }    

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const createdUser = await User.create({ username, password: hashedPassword });

    res.redirect("/")

} catch (error) {
    console.log("PROBLEM IN SIGNUP",error)
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render('auth/signup', { errorMessage: "teste"});
    } else if (error.code === 11000) {
      res.status(500).render('auth/signup', { errorMessage: ' Username or email already exists' });
    }
    next(error);
  }
});

/* INTERATION 2 */


router.get("/login", async (req, res, next) => {
    res.render("auth/login")
})

router.post("/login", async (req, res, next) => {
    const {username, password} = req.body
    try {
        if (!username || !password) {
            res.render('auth/login', {
              errorMessage: 'Please input your username and password',
            });
            return;
          }

    const user = await User.findOne({ username });

    if (!user) {    
      res.status(500).render('auth/login', {
        errorMessage:
          "Please input available username"
      })
    } else if (bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.redirect('/profile')
    } else {
        res.render('auth/login', {
          errorMessage: 'The password that you provide is not correct',
        })
    } 
    
    }catch (error) {
    console.log("PROBLEM IN SIGNUP",error)
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render('auth/signup', { errorMessage: "teste2"});
    } else if (error.code === 11000) {
      res.status(500).render('auth/signup', { errorMessage: ' Username or email already exists' });
    }
    next(error);
  }
});





module.exports = router;
