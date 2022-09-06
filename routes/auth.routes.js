const router = require("express").Router();
const UserModel = require("../models/User.model");
const bcrypt = require("bcryptjs");

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.get("/login", (req, res,) => {
  res.render("auth/login");
});

router.post("/signup", (req, res, next) => {
  const { password, username } = req.body;
  console.log(password);
    bcrypt
        .genSalt(10)
        .then((salts) => {
          return bcrypt.hash(password, salts);
        })
        .then((pass) => {
          return UserModel.create({ password: pass, username });
        })
        .then((user) => {
          res.redirect("/");
        })
        .catch((err) => next(err));
               
});


router.post("/login", (req, res, next) => {
  const { password, username } = req.body;
  let user;
  UserModel.findOne({ username })
    .then((userDb) => {
      user = userDb;
      return bcrypt.compare(password, user.password);
    })
    .then((isPassword) => {
      if (isPassword) {
        req.session.user = user;
        res.redirect("/");
      } else {
        res.render("auth/login", {
          message: "Usuario o contraseña incorrecta!",
        })
      }
    })
    .catch((err) => {
      next(err);
    });
});
module.exports = router;