const router = require("express").Router();
const User = require("../models/User.model");
//Setup of bcryp
const bcrypt = require("bcrypt");
const saltRounds = 10;

/* GET signup page */
router.get("/", (req, res, next) => {
  res.render("./auth/signup");
});
router.post("/", async (req, res, next) => {
  const { userName, password } = req.body;

  const passwordHash = await bcrypt.hash(password, saltRounds);

  User.create({ username: userName, password: passwordHash })
    .then((data) => {
      console.log("👶 New User Created");
    })
    .then(() => {
      res.render("./auth/signup");
    });
});

module.exports = router;
