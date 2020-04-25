const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const User = require("../models/user");

router.get("/signup", (req, res, next) => {
  try {
    res.render("auth/signup");
  } catch(e) {
    next(e);
  }
});

router.get("/login", (req, res, next) => {
  try {
    res.render("auth/login");
  } catch(e) {
    next(e);
  }
});

router.get("/logout", (req,res,next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  // TODO add fallbacks
  if (!username || !password) {
    res.render("auth/login", {
      errorMessage: "Please enter both username and password to login"
    }); 
    return;
  }

  User.findOne({"username": username})
  .then(user => {

    //TODO check if user exists
    if (!user) {
      res.render("auth/login", {
        errorMessage: "The username doesn't exist"
      });
      return;
    }

    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect("/");
    } else {
      res.render("auth/login", {
        errorMessage: "Incorrect password"
      })
    }
  });
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  // Making sure username and password are not empty
  if(username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username, email, and password"
    })
    return;
  } 

// Making sure that user doesn't exist already
User.findOne({ "username" : username})
.then( user => {
  if (user) {
    res.render("auth/signup", {
      errorMessage: "The username already exists"
    });
    return;
  }
  // User.findOne({ "email" : email})
  // .then( email => {
  //   if (email) {
  //     res.render("auth/signup", {
  //       errorMessage: "The username already exists"
  //     });
  //     return;
  //   }
  // });
  User.create({username, password: hashPass, email})
  .then(() => {
    res.redirect('/');
  })
  .catch(error => {
    next(error)
  })
});
})

module.exports = router;