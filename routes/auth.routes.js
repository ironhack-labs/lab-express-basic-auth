const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.render("signup", { errorMessage: "All fields needs to be filled" });
    return;
  }

  User.findOne({ username }).then((foundUser) => {
    if (foundUser) {
      res.render("signup", { errorMessage: "Choose another username" });
      return;
    }

    const hashingAlgorithm = bcrypt.genSaltSync(10);
    console.log("hashingAlgorithm:", hashingAlgorithm);
    const hashedPassword = bcrypt.hashSync(password, hashingAlgorithm);

    User.create({
      username,
      password: hashedPassword,
    }).then((newUser) => {
      console.log("newUser:", newUser);
      res.redirect("/");
    });
  });
});

module.exports = router;
