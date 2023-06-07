const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");

/* GET home page */
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const {username, password} = req.body;
  const hash = bcryptjs.hashSync(password);
  User.create({ username, password: hash})
    .then(user => {
      res.send(`user ${user.username} created!`);
    })
    .catch(error => {
      res.send("Error:" + error);
    })
});

module.exports = router;
