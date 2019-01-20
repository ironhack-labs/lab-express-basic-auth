const express = require('express');
const router  = express.Router();
const User = require("../models/user")
const bcrypt   = require("bcrypt")


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('login');
});

router.get("/signup", (req, res) => {
  res.render("signup")
})

router.post("/signup", (req, res) => {

  const name = req.body.username;
  const password = req.body.password;

  if (name === "" || password === "") {
    res.render("signup", {errorMessage: "all fields required"});
    return;
  }

  User.findOne({username: name}).then(user => {
    if(user !== null) {
      res.render("signup", {errorMessage: "username already exists"});
      return;
    }

     const salt = bcrypt.genSaltSync(10);
     const hash = bcrypt.hashSync(password, salt)


     User.create({
       username: name,
       password: hash
     }).then(() => {res.redirect("/")}).catch(err => {console.log(error)})


  })
})


// LOG IN

router.post("/login", (req, res) => {

  const name = req.body.username;
  const password = req.body.password;

  if (name === "" || password === "") {
    res.render("signup", {errorMessage: "please enter valid data"});
    return;
  }

  User.findOne({username: name}).then(user => {
    if(!user) {
      res.render("login", {errorMessage: "user does not exist"});
      return;
    }

    if(bcrypt.compareSync(password, user.password)) {

      // create session
      req.session.active = "true"
      res.redirect("/secret")

    } else {res.render("login", {errorMessage: "wrong password"})}
  })
})

// protoected routes

router.use((req, res, next) => {
  if(req.session.active) {
    next();
  } else {res.render("login", {errorMessage: "please log-in to access this page"})}
})

router.get("/secret", (req, res) => {
  res.render("secret")
})

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
})

module.exports = router;
