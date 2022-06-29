const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const saltRounds=12;
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

//SIGN UP
//sing up get
router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("auth/signup");
});
//sign up post
router.post("/signup", isLoggedOut, (req, res, next) => {
  const { role, ...restUser } = req.body;
  const salt = bcryptjs.genSaltSync(saltRounds);
  const newPassword = bcryptjs.hashSync(restUser.password, salt);

  User.create({ ...restUser, password: newPassword })
    .then((user) => {
      res.redirect(`/auth/profile/${user._id}`);
    })
    .catch((error) => {
      next();
    });
});

//LOG IN
//login get
router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("auth/login");
});
//login post
router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      //I am not sure if USER or USERNAME goes here
      if (!username) {
      }
      if (bcryptjs.compareSync(password, user.password)) {
        return res.redirect(`/auth/profile/${user._id}`);
      } else {
        res.send("invalid username or password");
      }
    })

    .catch((error) => {
      next();
    });
});
//LOG OUT
//log out get
router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render("auth/logout", { errorMessage: err.message });
    }
    res.redirect("/");
  });
});

//PROFILE
//profile get
router.get("/profile/:id", (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      res.render("user/success", user);
    })
    .catch((error) => {
      next();
    });
});

//Export routes
module.exports = router;