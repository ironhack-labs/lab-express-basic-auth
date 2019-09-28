const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("home", { title: "Home" });
});

//SIGN IN ROUTES
router.get("/signin", (req, res, next) => {
  res.render("signIn", { title: "Sign Up!" });
});

router.post("/signin", (req, res, next) => {
  //declaration sect
  const bcryptSalt = 10;
  let error;
  let { userName, password } = req.body; // deconstruction

  //if no username or pass
  if (userName == "" || password == "") {
    error = "Username or Password have not been typed";
    return res.render("signin", { title: "Sign Up!", error });
  }

  //use of bcyrpt
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  //find in DB, if document exists, by username
  User.findOne({ userName })
    .then(user => {
      if (user) {
        error = `Ya hay un usuario registrado con el username: ${user.userName}`;
        return res.render("signin", { title: "Sign Up!", error });
      }
      User.create({ userName, password: hashPass }).then(user => {
        res.redirect("/login");
      });
    })
    .catch(err => console.log(err));
});

//LOGIN ROUTES
router.get("/login", (req, res, next) => {
  res.render("login", { title: "Login" });
});
module.exports = router;

router.post("/login", (req, res, next) => {
  let error;
  let { userName, password } = req.body;

  //if no username or pass
  if (userName == "" || password == "") {
    error = "Username or Password have not been typed";
    return res.render("login", { title: "Login", error });
  }

  User.findOne({ userName })
    .then(user => {
      if (!user) {
        error = `Username: ${userName} is not registered in the plattform`;
        return res.render("login", { title: "Login", error });
      } else {
        const isValidPass = bcrypt.compareSync(password, user.password);
        if (isValidPass) {
          req.session.currentUser = user;
          return res.redirect("/profile/secret");
        } else {
          error = `Password not valid, try again`;
          return res.render("login", { title: Login, error });
        }
      }
    })
    .catch(err => console.log(err));
});

//LOGUT
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});
