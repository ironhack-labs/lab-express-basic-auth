const express = require('express');
const router  = express.Router();
const User    = require("../models/user");
const bcrypt         = require("bcryptjs");
const bcryptSalt     = 10;



/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});


router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username })
  .then(user => {
    if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists"
        });
        return;
      }

    const newUser  = User({
      username,
      password: hashPass
    });

    newUser.save()
    .then(user => {
      res.redirect("/");
    })
  })
});

router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username })
  .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error)
  })
});

router.use((req, res, next) => {
  console.log("req.session.currentUser", req.session.currentUser)
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});

  router.get("/main", (req, res, next) => {
    res.render("main");
  });

  router.get("/private",  (req, res, next) => {
    res.render("private");
  });



module.exports = router;
