const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const User = require("../models/User.model");

/* GET home page */

router.get("/", (req, res, next) => res.render("auth/login"));
//va post aquí

router.post("/", (req, res) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.findOne({ username: username })
    .then(user => {
      if (!user) {
        res.render("auth/login", { errorMessage: "The user doesn't exist." });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        console.log("aqui");
        res.redirect("/auth/main");
      } else {
        res.render("auth/login", { errorMessage: "Incorret password" });
      }
    })
    .catch(error => console.log("error", error));
});

router.get("/auth/signUp", (req, res) => res.render("auth/signUp"));
//va otro post

router.post("/signUp", (req, res) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.create({ username, password: hashPass })
    .then(() => res.redirect("/"))
    .catch(error => {
      console.log(error);
    });
});
router.get((req, res, next) => {
  req.session.currentUser = user;
  req.session.currentUser ? next() : res.redirect("/");
});
router.get("/auth/main", (req, res) =>
  res.render("auth/main", { user: req.session.currentUser })
);
module.exports = router;
