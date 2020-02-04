const express = require("express");
const router = express.Router();
const userModel = require("../models/User");
const bcrypt = require("bcrypt");
const protectRoute = require("../middlewares/protectRoute")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/sign-up", (req, res, next) => {
  res.render("sign-up");
});

router.get("/sign-in", (req, res, next) => {
  res.render("sign-in");
});

router.post("/sign-up", (req, res, next) => {
  const user = req.body;
  if (!user.username || !user.password) {
    req.flash("error", "Please fill all the fields")
    res.redirect("sign-up");
    return;
  } else {
    userModel
      .findOne({
        username: user.username
      })
      .then(userFound => {
        if (userFound) {
          req.flash("error", "Email already used");
          return res.redirect("sign-up");
        }
        const salt = bcrypt.genSaltSync(10);
        const hashed = bcrypt.hashSync(user.password, salt);
        user.password = hashed;

        userModel
          .create({
            username: user.username,
            password: user.password
          })
          .then(() => {
            req.flash("success", "Compte créé !");
            res.redirect("sign-up");
            //add some validation message
          })
          .catch(next);
      }).catch(next);
  }
});

router.post("/sign-in", (req, res, next) => {
  const user = req.body;
  if (!user.username || !user.password) {
    req.flash("error", "Please fill all the fields")
    res.redirect("sign-in");
    return;
  } else {
    userModel
      .findOne({
        username: user.username
      })
      .then(userFound => {
        if (!userFound) {
          req.flash("error", "Wrong Credentials");
          return res.redirect("sign-in");
        }
        if (bcrypt.compareSync(user.password, userFound.password)) {
          const clone = {
            ...userFound.toObject()
          }
          delete clone.password;
          req.session.currentUser = clone;
          return res.redirect("/");
        }
      }).catch(next);
  }
});
router.get('/sign-out', (req, res) => {
  req.session.destroy(() => {
    res.locals.isLoggedIn = undefined;
    res.locals.isAdmin = undefined;
    res.redirect("/sign-in");
  });
})
router.get('/main', protectRoute, (req, res) => {
  res.render('main')
})
router.get('/private', protectRoute, (req, res) => {
  res.render('private')
})
module.exports = router;