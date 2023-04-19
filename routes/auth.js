const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

router.get("/auth/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/auth/signup", (req, res, next) => {
  const { username, password } = req.body;
  // Signup validations
  // Check if fields are empty

  if (username === "") {
    res.render("signup", { message: "Username cannot be empty" });
    return;
  }

  if (password === "") {
    res.render("signup", { message: "Password cannot be empty" });
    return;
  }
  if (password.length < 8) {
    res.render("signup", { message: "Password must be atleast 8 characters" });
    return;
  }

  // Validation passed
  // Check if username is already taken

  User.findOne({ username }).then((userFromDB) => {
    if (userFromDB !== null) {
      res.render("signup", { message: "Username is already taken" });
      return;
    } else {
      // Username not taken
      // Hash and salt password for extra security
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
      console.log(hash);

      // Create user
      User.create({ username, password: hash })
        .then((createdUser) => {
          res.redirect("/auth/login");
        })
        .catch((err) => next(err));
    }
  });
});

router.get("/auth/login", (req, res, next) => {
  res.render("login");
});

router.post("/auth/login", (req, res, next) => {
  const { username, password } = req.body;

  // Login validations
  // Check if all fields are filled correctly
  if (username === "") {
    res.render("login", { message: "Username cannot be empty" });
    return;
  }

  if (password === "") {
    res.render("login", { message: "Password cannot be empty" });
    return;
  }

  // Find user in database by username
  User.findOne({ username }).then((userFromDB) => {
    if (userFromDB === null) {
      // User not existing in database => Render Login form again
      res.render("login", { message: "Username not found" });
      return;
    }

    // User existing in database
    // Check if input password matches with hashed one from database
    if (bcrypt.compareSync(password, userFromDB.password)) {
      // If password correct => login user
      req.session.user = userFromDB;
      req.session.user.passsword = null;
      console.log("This is the session: ", req.session);
      res.redirect("/profile");
    } else {
      res.render("login", { message: "Wrong username or password" });
      return;
    }
  });
});

router.get("/auth/logout", (req, res, next) => {
  // Logout user
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
