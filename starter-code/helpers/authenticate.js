const User = require("../models/User");
const bcrypt = require("bcrypt");

// middleware function to authenticate
const authenticate = (req, res, next) => {
  let { username, password } = req.body;
  User.findOne({ username })
    .then(user => {
      // user is an object, so it can't be compared to ""
      if (!user) {
        res.render("auth/login-signup", {
          err: "Incorrect User and/or password, please verify",
          login: req.url.includes("login")
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // store cookie
        req.session.currentUser = user;
        next();
      } else {
        res.render("auth/login-signup", {
          err: "Incorrect password",
          login: req.url.includes("login")
        });
        return;
      }
    })
    .catch(err => {
      console.log(`Error durante login`);
      console.log(err);
      res.render("auth/login-signup", {
        err: `An error has occurred during login, please try later`,
        login: false
      });
    });
};

module.exports = authenticate;
