const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

const saltRounds = 10;

router.post("/signup", (req, res) => {
  const { username, password } = req.body;

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
      return bcrypt.hash(password, salt);
    })
    .then((hashedPassword) => {
      return User.create({ username, password: hashedPassword });
    })
    .then((user) => {
      console.log("A new user was signed up: ", user);

      res.redirect("/profile");
    })
    .catch((error) => {
      console.log("An error occured while signing up a user: ", error);

      const showError = true;

      res.render("user/signup", { showError });
    });
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      console.log("User attempting to log in: ", user);
      if (!user) {
        console.log("No user found that matches the entered email adress");
        res.status(500).render("user/login");
      } else if (bcrypt.compareSync(password, user.password)) {
        console.log("User successfully logged in!");

        req.session.currentUser = user;
        res.redirect("/profile");
      } else {
        console.log("Wrong password entered");
        res.render("user/login");
      }
    })
    .catch((error) => {
      console.log("An error occured while loggin in a user: ", error);
      next(error);
    });
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    }
    res.redirect("/");
  });
});

router.get("/signup", (req, res) => {
  res.render("user/signup");
});

router.get("/login", (req, res) => {
  res.render("user/login");
});

router.get("/profile", (req, res) => {
  const userInSession = req.session.currentUser;

  res.render("user/profile", { userInSession });
});

module.exports = router;
