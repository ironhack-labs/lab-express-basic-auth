const { Router } = require("express");
const router = new Router();

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");
const mongoose = require("mongoose");

router.get("/signup", (req, res) => res.render("auth/signup"));

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      console.log(`Password hash: ${hashedPassword}`);

      return User.create({
        username,
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDb) => {
      console.log("Newly Created User!", userFromDb);
      res.redirect("/userProfile");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        //form
        res.status(500).render("auth/signup", { errorMessage: error.message }); //500 (Internal Server Error)
      } else if (error.code === 11000) {
        //ducplicate key error: Mongo DB error

        console.log(
          " Username and email need to be unique. Either username or email is already used. "
        );

        res.status(500).render("auth/signup", {
          errorMessage: "User not found and/or incorrect password.",
        });
      } else {
        next(error);
      }
    });
});


router.get("/userProfile", (req, res) => {
    res.render("users/user-profile", { userInSession: req.session.currentUser });
  });

//MIDDLEWARE!!!
// const private = require("../middleware/private");
// const showUser = (req, res) => {
//   res.render("users/user-profile", { userInSession: req.session.currentUser }); 
// } 
// next() from private.js file
// router.get("/userProfile",private, showUser) 
// => you can put as many as you want (middleware) like this!
// Same with the below;
// const private = require("../middleware/private");
// router.get("/userProfile", private, (req, res) => {
//   res.render("users/user-profile", { userInSession: req.session.currentUser });
// });


router.get("/login", (req, res) => res.render("auth/login"));

router.post("/login", (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  const { username, password } = req.body;
  console.log(req.body);

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to login.",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        console.log("username not registered. ");
        res.render("auth/login", {
          errorMessage: "User not found and/or incorrect password.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect("/userProfile");
      } else {
        console.log("Incorrect password. ");
        res.render("auth/login", {
          errorMessage: "User not found and/or incorrect password.",
        });
      }
    })
    .catch((error) => next(error));
});

//router.get('/userProfile', (req, res) => res.render('users/user-profile'));

router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
