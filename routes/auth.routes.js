const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const mongoose = require("mongoose");
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("auth/signup")
});

router.post("/signup", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;


  if (!username || !password) {
    res.render("auth/signup", {
      errorMessage: "All fields are mandatory. Please provide your username and password."
    });
    return;
  }

  // code imported from the student portal, need to clarify this step
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }



  bcrypt
    .genSalt(10)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({ username, password: hashedPassword });
    })
    .then(() => res.redirect("/profile"))
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        console.log(error);
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        console.log(error);
        res.status(500).render("auth/signup", {
          errorMessage: "Please provide a unique username. The one you chose is already taken."
        })
      }

      else {
        next(error);
      }
    })
});

router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("auth/login");
})

router.post("/login", (req, res, next) => {
  console.log("SESSION =====>", req.session);
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both username and password to login."
    });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (!user) {
        res.render("auth/login", { errorMessage: "Username isn't valid. Try again." });
        return;
      } else if (bcrypt.compareSync(password, user.password)) {
        //tried to follow along through the student portal and class notes, but got confused.
        // I think my app is crashing here but as of now I haven't found a solution.
        // IT IS WORKING BUT I'M NOT SURE WHY
        // code updated according to the student portal
        req.session.currentUser = user;
        res.redirect("/profile");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });

      }
    })
    .catch(error => next(error));
})

router.get("/profile", isLoggedIn, (req, res, next) => {
  res.render("auth/profile", { user: req.session.currentUser }); // Again: not sure what is userInSession but copied from student Portal
})

router.post("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect("/");
  })
})

router.get('/main', (req, res, next) => {
  if (req.session.currentUser) {
    res.render('auth/main')
  } else {
    res.redirect('/private')
  }
})

router.get('/private', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/login');
  } else {
    res.render('auth/private')
  }
})

module.exports = router;