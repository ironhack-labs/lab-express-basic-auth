const express = require('express');
const router = express.Router();
//requerimos el modelo.
const User = require('../models/User.model');

//Bycrypt
const bcrypt = require('bcryptjs');
const bcryptSalt = 10;

// GET Sign Up page
router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
  });

// POST Sign Up page.
router.post("/signup", (req, res, next) => {
    const { email, password } = req.body;

    if (email === "" || password === "") {
        res.render("auth/signup", {
            errorMessage: "Indicate a username and a password to sign up",
        });
        return;
    }

    User.findOne({ email })
    .then((user) => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists",
        });
        return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({ email, password: hashPass })
        .then(() => {
          res.redirect("/");
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      next(error);
    });
})

// GET Login page
router.get("/login", (req, res, next) => {
    res.render("auth/login");
  });

// POST Login page
router.post("/login", (req, res, next) => {
    const { email, password } = req.body;
    if (email === "" || password === "") {
      res.render("auth/login", {
        errorMessage: "Please enter both, username and password to login",
      });
      return;
    }
  
    User.findOne({ email })
    .then((user) => {
        if(!user) {
            res.render("auth/login", {
                errorMessage: "The username doesn't exist"
            });
            return;
        }
  
        if (bcrypt.compareSync(password, user.password)){

            req.session.currentUser = user;
            res.redirect('/')
        } else {
            res.render("auth/login", {
                errorMessage: "Incorrect password"
            })
        }
    })
    .catch((error) => {
        next(error);
    })
  });

router.get("/private", (req, res) => {
  res.render("private");
  });
  
router.get('/main', (req, res) => {
    res.render('main');
});


module.exports = router;
