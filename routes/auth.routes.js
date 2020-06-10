const { Router } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

const saltRounds = 10;

const router = new Router();
//SIGNUP ROUTES
router.get("/signup", (req, res, next) => res.render("auth/signup"));
router.post("/signup", (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !password) {
    res.render("auth/signup", {
      errorMessage: "Los campos no estan rellenados correctamente",
    });
  }
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPwd = bcrypt.hashSync(password, salt);
  User.create({
    username: username,
    passwordHash: hashedPwd,
  })
    .then((data) => {
      res.redirect("/");
    })
    .catch((err) => next(err));
});
//LOGIN ROUTES
router.get("/login", (req, res, next) => res.render("auth/login"));
router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter username and password",
    });
    return;
  }
  User.findOne({ username })
    .then(user => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'User not registered' })
        return;
      } else if (bcrypt.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect('/user-profile');
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password' })
      }
    })
    .catch(error => next(error));
});
//LOGOUT ROUTE
router.post('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/')
})
//USER PROFILE
router.get("/user-profile", (req, res, next) => {
  res.render("users/user-profile", req.session.currentUser)
});
module.exports = router;
