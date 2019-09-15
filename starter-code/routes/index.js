const express = require('express');
const router = express.Router();
const Users = require("../models/Users");
const bcrypt = require("bcrypt");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

//signup
router.get("/signup", (req, res, next) => {
  if (req.query.error) {
    if (req.query.error === "empty") {
      res.render("signup", {
        error: "The provided username and/or password were empty"
      });
    }

    if (req.query.error === "user-exists") {
      res.render("signup", { error: "The provided username already exists" });
    }
  } else {
    res.render("signup");
  }
});

router.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username.length === 0 || password.length === 0) {
    res.redirect("/signup?error=empty");
  }

  Users.findOne({ username: username }).then(foundUserData => {
    if (foundUserData === null) {
      const saltRounds = 8;

      const salt = bcrypt.genSaltSync(saltRounds);
      const encryptedPassword = bcrypt.hashSync(password, salt);

      Users.create({ username: username, password: encryptedPassword }).then(
        createdUserData => {
          // res.json({ clientCreated: true, createdUserData });
          // res.render("home");
          res.redirect("/home");
        }
      );
    } else {
      res.redirect("/signup?error=user-exists");
    }
  });
});

//login
router.get("/login", (req, res, next) => {
  if (req.query.error) {
    if (req.query.error === "empty") {
      res.render("login", {
        error: "The provided username and/or password were empty"
      });
    }

    if (req.query.error === "user-doesnot-exist") {
      res.render("login", { error: "The provided username does not exist" });
    }

    if (req.query.error === "wrong-password") {
      res.render("login", { error: "The provided password is incorrect" });
    }
  } else {
    res.render("login");
  }
});

router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username.length === 0 || password.length === 0) {
    res.redirect("/login?error=empty");
  }

  Users.findOne({ username: username }).then(foundUserData => {
    if (foundUserData === null) {
      res.redirect("/login?error=user-doesnot-exist");
    } else {
      const bcrypt = require("bcrypt");
      // yields: $2b$05$XGEx8RA6EKGsaW2Za1fS9usMAkGpmFvubJGq6a8jyIrDD0n/0LwhW
      const hashedPassword = foundUserData.password;

      if (bcrypt.compareSync(password, hashedPassword)) {
        req.session.user = foundUserData._id;
        res.redirect("/home");
        // res.render("home")
      } else {
        res.redirect("/login?error=wrong-password");
      }
    }
  });
});

router.get("/home", (req, res) => {
  console.log("your user id is: ", req.session.user)
  if (req.session.user) {
    Users.findById(req.session.user).then(yourInfo => {
      res.render("home", { yourInfo: yourInfo });
    })
  } else {
    res.redirect("/login");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    res.redirect("/");
  });
});

//middleware shitt
router.use((req, res, next) => {
  if (req.session.user) {
    router.get("/private", (req, res) => {
      res.render("private");
    });
    next();
  } else {
    res.redirect("/login");
  }
});
router.use((req, res, next) => {
  if (req.session.user) {
    router.get("/main", (req, res, next) => {
      res.render("main");
    });
    next();
  } else {
    res.redirect("/login");
  }
});


module.exports = router;