var express = require('express');
var router = express.Router();

// User model
const User = require("../models/user");
// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* GET users listing. */
router.get('/signup', function (req, res, next) {
    console.log("request:",req.session); //el parametro session es añadido por el paquete session 
    res.render('signup');
});

/* POST users listing. */
router.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, "username", (err, user) => {
    if (user !== null) {
      res.render("signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("signup", {
          errorMessage: "Something went wrong when signing up"
        });
      } else {
        // User has been created...now what?
        //res.render('index');
        res.redirect("/login");
      }
    });
  });
});

//login view
router.get("/login", (req, res, next) => {
  console.log(`LOGIN SESSION: ${JSON.stringify(req.session)}`);
  res.render("login");
});

/**
 we will check out if the user has inserted his data correctly, 
*  and we will save his data in the session if he logs in successful
 */
 router.post("/login", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("login", {
      errorMessage: "Indicate a username and a password to log in"
    });
    return;
  }

  User.findOne({ "username": username },
    "_id username password following",
    (err, user) => {
      if (err || !user) {
        res.render("login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          console.log(`SESSION: ${JSON.stringify(req.session)}`);
          req.session.currentUser = user;
          console.log(`CURRENT USER: ${JSON.stringify(req.session.currentUser)}`);
                       res.render("index", {
            user: user
          });

          // logged in
        } else {
          res.render("login", {
            errorMessage: "Incorrect password"
          });
        }
      }
  });
});

router.get("/logout", (req, res, next) => {
  console.log(`LOGOUT SESSION: ${JSON.stringify(req.session)}`);
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});


module.exports = router;