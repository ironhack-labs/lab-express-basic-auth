const authRouter = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");

authRouter.get("/register", (req, res) => {
  res.render("register");
});

authRouter.get('/login', (req, res) => {
  res.render('login')
});



authRouter.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  User.findOne({ $or: [{ username }, { email }] })
        .then((createdUser) => {
          console.log("createdUser:", createdUser);
          res.render("personalArea", { createdUser });
        })
        .catch((err) => {
          console.log(
            `something wrong with creating your account ${err}`
          );
        });
    })



authRouter.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  let user;
  User.findOne({ username })
    .then((userDb) => {
      user = userDb;
      return bcrypt.compare(password, user.password);
    })
    .then((isPassword) => {
      if (isPassword) {
        req.session.user = user;
        res.redirect('/profile');
      }
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = authRouter;