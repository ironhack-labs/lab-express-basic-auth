const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

router.get("/auth/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/auth/signup", (req, res, next) => {
  const { username, password } = req.body;

  // Check if username is already taken
  User.findOne({ username }).then((userFromDB) => {
    console.log(userFromDB);

    if (userFromDB !== null) {
      res.render("signup", { message: "Username is already taken" });
    } else {
      // Username is available
      // Hash password
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
      console.log(hash);

      // Create user
      User.create({ username: username, password: hash })
        .then((createdUser) => {
          console.log(createdUser);
          res.render("login");
        })
        .catch((err) => {
          next(err);
        });
    }
  });
});

// Create login

router.get("/auth/login", (req, res, next) => {
  res.render("login");
});

router.post("/auth/login", (req, res, next) => {
  const { username, password } = req.body;

  // Find user in database by username
  console.log("req.body", req.body);

  User.findOne({ username: username })
    .then((userFromDB) => {
      console.log("!!!!!!!!!", userFromDB);

      console.log(req.session);

      // Check if password from input form matches hashed password from database
      const valid = bcrypt.compareSync(password, userFromDB.password);

      if (valid) {
        req.session.user = userFromDB;
        res.render("index");
      } else {
        res.render("login", { message: "Wrong credentials" });
      }
    })
    .catch((err) => {
      console.log("error:", err);
    });
});
module.exports = router;
