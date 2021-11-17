const router = require("express").Router();
const User = require("./../models/User.model");
const bcrypt = require("bcryptjs");
const zxcvbn = require("zxcvbn");

const saltRounds = 10;

/* GET home page */
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  // Check if the username and the password are provided
  const usernameNotProvided = !username || username === "";
  const passwordNotProvided = !password || password === "";

  if (usernameNotProvided || passwordNotProvided) {
    res.render("auth/signup", {
      errorMessage: "Provide username and password.",
    });

    return;
  }

  //Check the password strength (optional)
  const passwordCheck = zxcvbn(password);
  console.log("passwordCheck", passwordCheck);

  if (passwordCheck.score < 3) {
    res.render("auth/signup", {
      errorMessage: "Password too weak, try again.",
    });

    return;
  }

  // Check that the username is not taken
  User.findOne({ username: username })
    .then((foundUser) => {
      if (foundUser) {
        throw new Error("The username is taken");
      }

      // Generating the salt string
      return bcrypt.genSalt(saltRounds);
    })
    .then((salt) => {
      // Encrypt the password
      return bcrypt.hash(password, salt);
    })
    .then((hashedPassword) => {
      // Create the new user
      return User.create({ username: username, password: hashedPassword });
      // return User.create({ username, password: hashedPassword });
    })
    .then((createdUser) => {
      // Redirect to the home `/` page after the successful signup
      res.redirect("login");
    })
    .catch((err) => {
      res.render("auth/signup", {
        errorMessage: err.message || "Error while trying to sign up",
      });
    });
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if the username and the password are provided
  const usernameNotProvided = !username || username === "";
  const passwordNotProvided = !password || password === "";

  if (usernameNotProvided || passwordNotProvided) {
    res.render("auth/login", {
      errorMessage: "Provide username and password.",
    });

    return;
  }

  let user;
  // Check if the user exists
  User.findOne({ username: username })
    .then((foundUser) => {
      user = foundUser;

      if (!foundUser) {
        throw new Error("Wrong credentials");
      }

      // Compare the passwords
      return bcrypt.compare(password, foundUser.password);
    })
    .then((isCorrectPassword) => {
      if (!isCorrectPassword) {
        throw new Error("Wrong credentials");
      } else if (isCorrectPassword) {
        // Create the session + cookie and redirect the user
        // This line triggers the creation of the session in the DB,
        // and setting of the cookie with session id that will be sent with the response
        req.session.user = user;
        res.redirect("/");
      }
    })
    .catch((err) => {
      res.render("auth/login", {
        errorMessage: err.message || "Provide username and password.",
      });
    });
});

module.exports = router;
