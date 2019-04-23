const express = require('express');
const authRoutes = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const bcryptSalt = 10;

authRoutes.get("/signup", (req, res, next) => {
  res.render('auth/signup');

})

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username, password);
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});


authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
});

authRoutes.post("/login", (req, res, next) => {

    const {username, password} = req.body;

    let passCheck = new Promise ((resolve, reject) => {
      if (username === "" || password === ""){
        return reject(new Error("Indicate a username and a password to sign up"));
      }
      resolve();
    }) 
  
    passCheck.then(() => {
      return User.findOne({ "username": username })
    }) 
    .then( user => {
      if(!user) throw new Error("The username doesn't exist");
  
      if (!bcrypt.compareSync(password, user.password)){
        throw new Error("Incorrect Password");
      }
  
      req.session.currentUser = user;
      console.log(`LOGGED AS USER ${user.username}`);
      res.redirect("/");
  
    })
    .catch( e => {
      res.render("auth/login", {
        errorMessage: e.message
    });
    });
  });

module.exports = authRoutes;