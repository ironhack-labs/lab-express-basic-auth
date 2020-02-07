const express = require('express');
const router  = express.Router();
const bcrypt  = require(`bcrypt`);
const Users   = require("../models/Users")
const session = require("express-session")
const MongoStore = require("connect-mongo")(session);




router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/signup', (req, res, next) => {
  const saltRounds = 10;
  if (req.body.username.trim() === "" || req.body.password.trim() === ""){
    res.render("signup", {error: "user or password are empty"})
    return;
  }
  const plainPassword = req.body.password;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(plainPassword,salt);

  Users.findOne({ name: req.body.username}).then((userFound) => {
    if (userFound !== null) {
      res.render("signup", {error: "User already exist"})    
    } else {
      Users.create({username: req.body.username , password: hash})
      .then(() => {
        res.redirect("login");
      })
      .catch(() => {
        res.render("signup", {error: "User already exist"}) 
      })
    }
  })
});

router.post('/login', (req, res, next) => {
  if (req.body.username.trim() === "" || req.body.password.trim() === "") {
    res.render("login", {error: "user or password are empty"})
    return;
  }
  Users.findOne({username:req.body.username}).then((foundUser) => {
    if (foundUser) {
      if(bcrypt.compareSync(req.body.password, foundUser.password)) {
        req.session.currentUser = foundUser._id;
        res.redirect('main')
      } else res.render("login", {error: "Your password is incorrect"})
    } else res.render("login", {error: "user not found"})
  })
});

router.get('/main', (req, res, next) => {
  if (req.session.currentUser) {
     res.render('main');
    } else {res.redirect("/")}
});
router.get('/private', (req, res, next) => {
  if (req.session.currentUser) {
     res.render('private');
    } else {res.redirect("/")}
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/login");
  });
});
module.exports = router;
