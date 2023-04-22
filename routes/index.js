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
  res.render("auth/signup", {});
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
  res.render("auth/login", {});
});

router.post("/login", function (req, res, next) {
  console.log("req.session is: ", req.session);

  User.findOne({ username: req.body.username })
    .then(function (userFromDB) {
      console.log("userFromDB is", userFromDB);

      if (userFromDB) {
        if (bcrypt.compareSync(req.body.password, userFromDB.password)) {
          req.session.currentUser = userFromDB;
          res.redirect("private");
        } else {
          res.render("auth/login", {
            errorMessage: "Wrong !",
          });
        }
      } else {
        res.render("auth/login", {
          errorMessage: "utilisateur inconnu",
        });
      }
    })
    .catch((err) => next(err));
});

router.get("/private", function (req, res, next) {
  if (req.session.currentUser) {
    res.render("private", {
      userFromDB: req.session.currentUser,
    });
  } else {
    res.redirect("login");
  }
});

router.get("/main", function (req, res, next) {
  if (req.session.currentUser) {
    res.render("main", {
      userFromDB: req.session.currentUser,
    });
  } else {
    res.redirect("login");
  }
});

router.get("/logout", function (req, res, next) {
  req.session.destroy();

  res.redirect("/");
});
module.exports = router;
