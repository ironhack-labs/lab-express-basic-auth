const router = require("express").Router();

const bcrypt = require("bcryptjs");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const User = require("../models/User.model");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next) => {
  res.render("signup", {});
});

router.post("/signup", (req, res, next) => {
  console.log("The form data : ", req.body);

  const passwordHash = bcrypt.hashSync(req.body.password, salt);

  new User({
    username: req.body.username,
    password: passwordHash,
  })
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => next(err));
});

router.get("/login", function (req, res, next) {
  res.render("login", {});
});

router.post("/login", function (req, res, next) {
  User.findOne({ username: req.body.username })
    .then((userFromDB) => {
      console.log("userFromDB is", userFromDB);

      if (userFromDB) {
        if (bcrypt.compareSync(req.body.password, userFromDB.password)) {
          res.send("WELCOME");
        }
      }
    })
    .catch((err) => next(err));
});

module.exports = router;
