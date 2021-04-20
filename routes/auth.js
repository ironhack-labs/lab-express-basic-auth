const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");

/* GET home page */
router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  const { username, email, password } = req.body;

  if (username === "") {
    res.render("signup", { message: "Your username cannot be empty" });
    return;
  }

  User.findOne({ username: username }).then((user) => {
    if (user !== null) {
      res.render("signup", { message: "This username is already taken" });
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
      console.log(`Password hash:`, hash);

      User.create({ username: username, email: email, password: hash }).then(
        (createdUser) => {
          res.redirect("/");
        }
      );
    }
  });
});

module.exports = router;
