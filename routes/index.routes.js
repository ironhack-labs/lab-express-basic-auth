const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const salt = 10;
const app = require("../app");

// const shouldNotBeAuthenticated = (req, res, next) => {
//   if (req.session.user) {
//     return res.redirect("/");
//   }
//   next();
// };

/* GET home page */
router.get("/", (req, res, next) => res.render("index"));

router.get("/signup", (req, res) => {
  res.render("signup");
});
router.post("/signup", (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((foundUser) => {
      console.log("foundUser:", foundUser);
      if (foundUser) {
        res.render("signup", {
          errorMessage: "Either username or email is already taken",
        });
        //  warn either option is already taken
        return;
      }

      bcrypt
        .genSalt(salt)
        .then((generatedSalt) => {
          return bcrypt.hash(password, generatedSalt);
        })
        .then((hashedPassword) => {
          return User.create({
            username,
            password: hashedPassword,
          });
        })
        .then((userCreated) => {
          console.log("userCreated:", userCreated);
          // req.session.user = userCreated;
          res.redirect("/");
        });
    })
    .catch((err) => {
      console.log("err:", err);
      res.render("/signup", { errorMessage: err.message });
    });
});

router.get("/login", (req, res) => {
  // if (req.session.user) {
  //   return res.redirect("/");
  // }
  // next();
  res.render("login");
});

router.post(
  "/login",
  /*shouldNotBeAuthenticated,*/ (req, res) => {
    const { username, password } = req.body;

    // if (username.length < 4 || password.length < 8) {
    //   //   error handling
    // }

    User.findOne({ username }).then((user) => {
      if (!user) {
        // please provide a correct username

        res.render("login", {
          errorMessage: "User does not exist",
        });

        return; //   error handle and say wrong username
      }
      console.log(user);
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          // wrong password. try again
          //  error handle and say wrong password
          res.render("login", {
            errorMessage: "Password doesn't match",
          });

          return;
        }
        console.log(user);
        req.session.user = user;
        console.log("You are now logged in");
        res.redirect("/");
      });
    });
  }
);

module.exports = router;
