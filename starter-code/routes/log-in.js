var express = require("express");
var loginRouter = express.Router();
const User = require("./../models/User");
const bcrypt = require("bcrypt");

// GET/login
loginRouter.get("/", (req, res) => {
  res.render("../views/log-in.hbs");
});

// POST /login
loginRouter.post("/", (req, res) => {
  const { username, password } = req.body;
  if (password === "" || username === "") {
    res.render("../views/log-in.hbs", {
      errorMessage: "Username and Password are required"
    });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (!user) {
        res.render("../views/log-in.hbs", {
          errorMessage: "Given username doesn't exist."
        });
        return;
      }

      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("../views/log-in.hbs", {
          errorMessage: "Incorrect password!"
        });
      }
    })
    .catch(err => console.log(err));
});

module.exports = loginRouter;