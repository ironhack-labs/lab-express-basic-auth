const router = require("express").Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// 1. route d'affichage
router.get("/signup", (req, res, next) => {
  res.render("signup", {});
});

// 2. route de traitement
router.post("/signup", function (req, res, next) {
  // req.body
  new User({
    username: {
      type: req.body.username,
      //unique: true,
    },
    password: req.body.password, //hash
  })
    // TODO: creer un user en base(avec les infos saisies)
    .save()
    .then(function (newUserFromDB) {
      res.send("ok new user!!");
      //res.redirect("profilUser.hbs")
    })
    .catch(function (err) {
      "erreur lors de la creation User", err;
    });
});

module.exports = router;
