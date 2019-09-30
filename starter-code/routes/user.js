const express = require("express");
const router = express.Router();
const usersModel = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
router.get("/signup", (req, res) => {
  res.render("createUser");
});
router.post("/signup", (req, res, next) => {
  const newUser = new usersModel(req.body);
  newUser.password = bcrypt.hashSync(newUser.password, bcrypt.genSaltSync(bcryptSalt));
  console.log(newUser);
  newUser
    .save()
    .then(result => res.redirect("/"))
    .catch(err => res.render("createUser"));
});

router.get("/signin", (req, res) => {
  res.render("logUser");
});
router.post("/signin", (req, res, next) => {
  const { username, password } = req.body;
  usersModel
    .findOne({ username })
    .then(user => {
      console.log(user, password, username, user.password);

      if (bcrypt.compareSync(password, user.password)) {
        //A senha bate
        console.log("login realizado");
        req.session.currentUser = user;
        res.redirect("/private");
      }
    })
    .catch(err => {
      console.log(err);
      res.redirect("/user/signin");
    });
});

module.exports = router;
