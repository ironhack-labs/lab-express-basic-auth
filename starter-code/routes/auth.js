const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//Route HomePage
router.get("/", (req, res) => {
  res.render("index");
});

//Route get for sign up
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

//Route Post for sign up
router.post("/signup", (req, res, next) => {
  let username = req.body.username;
  let pass = req.body.password;

  //Bcrypt encryption methods (Do not forget)
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(pass, salt);

  //First validation the user and pass cannot be empty
  if (username === "" || pass === "") {
    res.render("auth/signUp", {
      errorMessage: "The username or password cannot be empty"
    });
  }
  //Second validation the user must be unique for each sign up
  User.findOne({
    username: username
  }).then(user => {
    //if the user is found on db
    if (user !== null) {
      res.render("auth/signUp", {
        errorMessage: "The user already exists"
      });
      return;
    }

    const newUser = User({
      username,
      password: hashPass
    });

    newUser
      .save()
      .then(user => {
        res.redirect("/");
      })
      .catch(err => console.log(err));
  });
});

//route get for Log in
router.get("/login", (req, res) => {
  res.render("auth/login");
});

//Route post for login
router.post("/login", (req, res) => {

  let username = req.body.username;
  let password = req.body.password;

  //the username or password cannot be empty
  if (username === "" || password === "") {

    res.render("auth/login", {
      errorMessage: "The username or password cannot be empty"
    });
    return
  }

  //Check for the user on the database
  User.findOne({
      "username": username
    })
    .then(user => {

      console.log(user);

      //first validation (the user does not exist)
      if (!user) {
        res.render('auth/login', {
          errorMessage: `The user : ${username} does not exist!!!`
        })
        return
      }

      //second validation (the password does not match)
      //We need to compare the hashed password
      if (bcrypt.compareSync(password, user.password)) {
        //the user was found, create a session
        req.session.currentUser = user;
        res.redirect('/')
      } else {
        res.render("auth/login", {
          errorMessage: "Invalid password"
        })
      }
    })
    .catch(err => {
      console.log(err);
    });
});


module.exports = router;