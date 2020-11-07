require('dotenv').config();

const {
  genSaltSync
} = require("bcrypt")
const express = require('express'),
  cookieParser = require('cookie-parser'),
  router = express.Router(),
  bcrypt = require("bcrypt"),
  User = require("../models/User.model"),
  session = require('express-session');


router.use(cookieParser());

//esto no va aqui, pero por alguna "·$%& " razón no lo extraé de /configs/session
router.use(session({
  secret: process.env.SESS_SECRET,
  resave: false,
  saveUninitialized: true
}))
//RUTESS
router.get("/signup", (req, res) => {
  res.render("auth/signup")
})

router.post("/signup", async (req, res) => {
  const {
    name,
    email,
    password
  } = req.body
  if (name === "" || email === "" || password === "") {
    return res.render("auth/signup", {
      error: "Missing fields"
    })
  } else {
    const user = await User.findOne({
      email
    })

    if (user) {
      return res.render("auth/signup", {
        error: "ya hay un usuario con esos datos"
      })
    }
    const salt = bcrypt.genSaltSync(12)
    const hashpwd = bcrypt.hashSync(password, salt)

    User.create({
      "name": name,
      "email": email,
      "password": hashpwd

    }).then(newUser => {
      req.session.currentUser = newUser
      console.log(req.session.currentUser);
      res.render("auth/profile", {
        newUser
      });
    });
  }
})





router.get("/login", (req, res) => {
  res.render("auth/login")
})

router.post('/login', (req, res, next) => {
  const {
    email,
    password
  } = req.body;

  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }

  User.findOne({
      email
    })
    .then(user => {
      //user is the output of the .findOne, its put in the session as currentUser
      req.session.currentUser = user
      if (!user) {
        res.render('auth/login', {
          errorMessage: 'Email is not registered. Try with other email.'
        });
        return;
      } else if (bcrypt.compareSync(password, user.password)) {
        res.render('auth/profile', {
          user
        });
      } else {
        res.render('auth/login', {
          errorMessage: 'Incorrect password.'
        });
      }
    })
    .catch(error => next(error));
});


router.get("/profile", (req, res) => {
  res.render("auth/profile", {
    user: req.session.currentUser
  })
})



router.get("/private", (req, res) => {
  if (req.session.currentUser) {
    res.render("private");
  } else {
    req.session.destroy()
    res.render("index", { error: "No logged " })
    // res.redirect("/")
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy()
  res.redirect("/")
})

router.get("/main", (req, res) => {
  if (req.session.currentUser) {
    res.render("main");
  } else {
    req.session.destroy()
    res.render("index", { error: "No logged " })
    // res.redirect("/")
  }
});







module.exports = router
