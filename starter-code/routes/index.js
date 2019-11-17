const express = require('express');
const router  = express.Router();
const bcrypt       = require("bcrypt");
const User         = require("../models/user");
const bcryptSalt   = 10;

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.get("/login", (req, res, next) => {
  res.render("login");
});


//SIGN UP-----------------------------------
router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  // const salt     = bcrypt.genSaltSync(bcryptSalt);
  // const hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    res.render("signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
  User.findOne({ "username": username })
  .then(user => {
    if (user !== null) {
        res.render("signup", {
          errorMessage: "The username already exists!"
        });
        return;
      }
  
      const salt     = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
  
      User.create({
        username,
        password: hashPass
      })
      .then(() => {
        res.render ("signup",{createUser: "Cuenta de Usuario creada"})
        // res.redirect("/");
      })
      .catch(error => {
        console.log(error);
      })
  })
  .catch(error => {
    next(error);
  })
});

//LOGIN-------------------------------------
router.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({ "username": theUsername })
  .then(user => {
      if (!user) {
        res.render("login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error);
  })
});

//SESSION PATH-------------------
router.use((req, res, next) => {
  if (req.session.currentUser) { 
    next();
  } else {                          
    res.redirect("/login");         
  }                                
});                            

router.get("/private", (req, res, next) => {
  res.render("private");
});

router.use((req, res, next) => {
  if (req.session.currentUser) { 
    next();
  } else {                          
    res.redirect("/login");         
  }                                
});                            

router.get("/main", (req, res, next) => {
  res.render("main");
});

module.exports = router;
