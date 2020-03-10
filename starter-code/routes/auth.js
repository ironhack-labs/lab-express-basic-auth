//CREATES THE ROUTE FOR THE SIGNUP PAGE

const express = require("express");
const router = express.Router();

//you can copy the lines below twice (instead of once) and change /signup in both places to where you want it to route/render with less code

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

//CREATING ROUTE FOR LOGIN 

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});


//CREATES ROUTE FOR THE POST METHOD FORM

// User model
const User = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

//

//I THINK THIS IS HOW YOU SET UP THE ROUTE BELOW THAT ALLOWS USERS TO DO POST REQUEST
router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  
  //BELOW IS FORM VALIDATION -- MAKES SURE EVERYTHING ENTERED IS VALID Note how we specify as a second parameter of the res.render() method an object with an errorMessage key.....REFERENCE SIGNUP.HBS TO SEE WHAT THIS IS TALKING ABOUT...notice how it is inside the .create 
  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
  //BELOW CODE CHECKS IF THE USERNAME IS ALREADY IN THE DATABASE THEN THROWS ERROR IF SO 
  
  
  User.findOne({ "username": username })
  .then(user => {
    if (user !== null) {
      res.render("auth/signup", {
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
      res.redirect("/");
    })
    .catch(error => {
      console.log(error);
    })
  })
  
  
  // SAVES ALL ERRORS AS PREVIOUS ERRORS
  .catch(error => {
    next(error);
  })
  
  
  
});


//POST FOR LOGIN 

router.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({ "username": theUsername })
  .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
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
    next(error);
  })
});


module.exports = router;

