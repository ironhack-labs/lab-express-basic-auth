const express = require("express");
const authRoutes = express.Router();
const User = require("../models/users");
// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

authRoutes.get("/", (req,res,next)=> {
  res.render("index");
});

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});


authRoutes.post("/signup", (req, res, next) =>{
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === ""){
    res.render("auth/signup", {
    errorMessage: "Claim your identity to gain access (⌐■_■)"
    });
     return;
  }

  User.findOne({ "username": username})
  .then(user =>{
    if(user !== null){
      res.render("auth/signup", {
        errorMessage: "Don't be a copy cat, be a cool cat and come up with another one"
      });
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
    username, 
    password: hashPass
  });
  newUser.save()
  .then(user => {
  res.redirect("/");
  });
 
});
});

authRoutes.get("/login", (req, res, next) =>{
  res.render("auth/login");
});

authRoutes.get("/main", (req, res, next) =>{
  res.render("auth/main");
});

authRoutes.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist !!!"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/main");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect username or password"
        });
      }
  });
});

authRoutes.get('/logout', (req, res, next) => {
  req.session.destroy((err)=>{
    res.redirect("/login");
  })
})


module.exports = authRoutes;