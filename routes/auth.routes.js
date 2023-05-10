const { Router } = require("express");
const bcryptjs = require("bcryptjs");
// rounds of encription
const saltRounds = 10;

// require the User Model
const mongoose = require("mongoose");
const User = require("../models/User.model");

const router = new Router();

// Require Auth Middleware
//const {isLoggedIn, isLoggedOut} = require('../middleware/route-guard');

// password: mycutegrandma123

// hashedPassword: dfgyqrwihuyqg38r17y93uhb3r

// SIGNUP //
router.get("/signup", (req, res) => {
  res.render("auth/signup.hbs");
});

// POST Route --> to post info of the form and create a new user
router.post("/signup", (req, res) => {
  // req stands for the request
  // res stands for the response
  const { username, password } = req.body;

  // Make sure my password is strong

  // Makes sure that you have at least one lowercase letter, one uppercase letter and 6 digits.
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

  if (!regex.test(password)) {
    res
      .status(500)
      .render("auth/signup", {
        errorMessage:
          "Password needs to have at least 6 characters, 1 lowercase letter and 1 uppercase letter",
      });
    return;
  }

  // Make sure users fill all mandatory fields
  if (!username || !password) {
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please add your username  and password , if you may.",
    });
    return;
  }

  async function encriptPassword() {
    try {
      // salt is a random string
      let salt = await bcryptjs.genSalt(saltRounds);
      // combines salt and password --> FUSION, AHH!
      let hashedPassword = await bcryptjs.hash(password, salt);
      //console.log(`Password hash: ${hashedPassword}`);

      // save to DB
      let newUser = await User.create({
        username,
        passwordHash: hashedPassword,
      });

      // Redirect to User Profile
      res.redirect("/userProfile");
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res
          .status(500)
          .render("auth/signup", {
            errorMessage:
              "Username must be unique. Choose an username that is original, if you may.",
          });
      } else {
        console.log(error);
      }
    }
  }

  encriptPassword();
});

router.get("/userProfile", (req, res) => {
  res.render("user/user-profile.hbs", {
    userInSession: req.session.currentUser,
  });
});

// LOGIN //

// GET Route to display the login form to the user
router.get("/login", (req, res) => {
  res.render("auth/login.hbs");
});

// POST Route to validate the user

router.post("/login", (req, res) => {
  console.log(req.session);
  const { username, password } = req.body;

  // Validade if the user submitted email / password blank
  if (username === "" || password === "") {
    res.render("auth/login.hbs", {
      errorMessage: "Please fill all the required fields, if you may.",
    });
    return;
  }

  async function manageDb() {
    try {
      let user = await User.findOne({username});
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Username is not registered. Try other, if you may.",
        });
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        console.log("loggedin");
        req.session.currentUser = user;
        res.redirect("/userProfile");
      } else {
        res.render("auth/login", { errorMessage: "Wrong Password" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  manageDb();
});
// POST Route to logout
router.post("/logout", (req, res) => {
  // Kill the Session
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
  
      

 

    // Redirect to Homepage
    res.redirect("/");
  });
});



function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/main');
  }

  // Main route
router.get('/main', isAuthenticated, function(req, res) {
    res.render('./main.hbs', { title: 'Main Page' });
  });
  
  // Private route
router.get('/private', isAuthenticated, function(req, res) {
    res.render('./private.hbs', { title: 'Private Page' });
  });


/// Export Router
module.exports = router;
