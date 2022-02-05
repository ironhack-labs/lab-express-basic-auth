// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const saltRounds = 10;
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

// all your routes here
router.get("/auth/signup", isLoggedOut, (req, res, next) =>
  res.render("auth/signup")
);

router.post("/auth/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render("auth/signin", {
      errorMessage: `Username is not registered. Maybe try another username?`
    });
  }



  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) =>
      User.create({ username, password: hashedPassword })
    )
    .then((user) => {
      console.log("Newly created user is: ", user);
      console.log(user);
      req.session.currentUser = user;
      res.locals.userIsConnected = req.session.currentUser;
      res.redirect("/user");
    })
    .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/signup', { errorMessage: error.message ,body:req.body});
        }else if (error.code === 11000) { 
            res.status(500).render('auth/signup', {
                errorMessage: 'Username need to be unique. Either username or email is already used.',
                body:req.body
            });
        }else {
            next(error);
        }
    });
});

router.get("/auth/signin", isLoggedOut, (req, res, next) =>
  res.render("auth/signin")
);

router.post("/auth/signin", (req, res, next) => {
  const { username, password } = req.body;

  console.log("SESSION =====> ", req.session);

  // req.body destructuring
  // and email and password validation stay the same
  User.findOne({ username })
    .then((user) => {
      console.log("user found =>", user);
      if (!user) {
        res.render("auth/signin", {
          errorMessage: `Username is not registered. Maybe try another username?`,
          body:req.body
        });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        console.log(user);

        req.session.currentUser = user;
        res.locals.userIsConnected = req.session.currentUser;
        res.redirect("/user");
      } else {
        res.render("auth/signin", {
          errorMessage: "Username or password is wrong.",
          body:req.body
        });
      }
    })
    .catch((error) => next(error));
});

router.post("/auth/signout", (req, res, next) => {
  res.locals.userIsConnected = false;

  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
