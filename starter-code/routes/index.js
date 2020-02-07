

const express = require('express');
const router  = express.Router();


const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const mongoose = require("mongoose");
const Users = require("../models/User");

router.use(
  session({
    saveUninitialized: true,
    resave: true,
    secret: "basic-auth-secret",
    cookie: { maxAge: 60000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    })
  })
);

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.get("/signup", (req, res) => {
  res.render("signup");
});
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/signup", (req, res) => {
  const saltRounds = 10;
  if (req.body.username === "" || req.body.password === "") {
    res.json({ authorised: false, reason: "Bad credentials" });
    return;
  }
  const plainPassword1 = req.body.password;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(plainPassword1, salt);
  Users.findOne({ name: req.body.username }).then((userFound) => {
    if (userFound !== null) {
      res.json({ authorised: false, reason: "User exists" });
    } else {
      Users.create({ name: req.body.username, password: hash })
        .then((userCreated) => {
          res.json({ created: true, userCreated });
        })
        .catch(() => {
          res.json({ created: false });
        });
    }
  });
});

router.get("/private", (req, res) => {
  if (req.session.currentUser) {
    Users.findById(req.session.currentUser).then((allUserData) => {
      allUserData.name = `🦄🦄🦄${allUserData.name.toUpperCase()}🦄🦄🦄` 
      allUserData.salary = 100000000
      res.render("private", {
        user: allUserData
      });
    });
  } else {
    res.redirect("/login");
  }
});

router.post("/login", (req, res) => {
  function notFound(reason) {
    res.json({ authorised: false, reason });
  }
  if (req.body.username === "" || req.body.password === "") {
    res.render("login", {error: "user or password are empty"})
    return;
  }

  Users.findOne({ name: req.body.username })
    .then((userFound) => {
     
      if (bcrypt.compareSync(req.body.password, userFound.password)) {
        //continue login
        console.log('user has log')
        req.session.currentUser = userFound._id;
        res.redirect("/private");
        // res.json({ authorised: true });
      } else {
        // notFound("password or user are wrong");
        res.render("login", {error: "password is wrong"})
      }
    })
    .catch((userNotFoundError) => {
      res.render("login", {error: "user not found"})
    });
});

module.exports = router;
