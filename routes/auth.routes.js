// Require Express Method that helps us to create Routes
// 2nd way of requiring Router
const { Router } = require("express");
// bcrypt is a npm package that encrypts passwords
const bcryptjs = require("bcryptjs");
// rounds of encription
const saltRounds = 10;

// require the User Model
const mongoose = require("mongoose");
const User = require("../models/User.model");

const router = new Router();

// Require Auth Middleware
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

// password: mycutegrandma123

// hashedPassword: dfgyqrwihuyqg38r17y93uhb3r

// SIGNUP //

// GET Route --> display the 'signup' form to the user
router.get(
  "/signup",
  /* isLoggedOut, */ (req, res) => {
    res.render("auth/signup.hbs");
  }
);

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
        "All fields are mandatory. Please add your username and password, if you may.",
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
        // HTTP Response Codes
        // 200 - successful response
        // 4xx - client-side error;
        // 404 - not found on client;
        // 5xx - server-sider error;
        // 505 - not found on server;
        // 11000 - native MongoDB error --> you tried to sumbit a value that was created before.
        // same email / same username as other user.

        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res
          .status(500)
          .render("auth/signup", {
            errorMessage:
              "Username and email must be unique. Choose an username / email that are original, if you may.",
          });
      } else {
        console.log(error);
      }
    }
  }

  encriptPassword();
});

router.get(
  "/userProfile",
  /* isLoggedIn, */ (req, res) => {
    res.render("user/userProfile.hbs", {
      userInSession: req.session.currentUser,
    });
  }
);

// LOGIN //

// GET Route to display the login form to the user
router.get("/login", (req, res) => {
  res.render("auth/login.hbs");
});

// POST Route to validate the user

router.post("/login", (req, res) => {
  console.log(req.session);
  const { username, password } = req.body;

  // Validade if the user submitted  / password blank
  if (username === "" || password === "") {
    res.render("auth/login.hbs", {
      errorMessage: "Please fill all the required fields, if you may.",
    });
    return;
  }

  async function manageDb() {
    try {
      let user = await User.findOne({ username });
      if (!user) {
        res.render("auth/login", {
          errorMessage: "username is not registered. Try other, if you may.",
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

/// Export Router
module.exports = router;
