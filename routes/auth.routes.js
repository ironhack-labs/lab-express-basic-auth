const router = require("express").Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User.model");
const saltRounds = 10;

// SIGN UP
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res) => {
  console.log(req.body);

  const { email, password } = req.body;

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
      console.log("LabSalt", salt);

      return bcrypt.hash(password, salt);
    })
    .then((hashedPassword) => {
      console.log("Hashed Password ", hashedPassword);
      return User.create({
        email: email,
        passwordHash: hashedPassword,
      });
    })
    .then((result) => {
      console.log(result);
      res.redirect("/profile");
    })
    .catch((err) => {
      console.log(err);
    });
});

// LOGIN
router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.render("auth/login", {
      errorMessage: "Please enter your email and password to login.",
    });
    return;
  }
  User.findOne({ email })
  .then(user => {
    console.log(user);
    if (!user) {
      res.render("auth/login", {
        errorMessage: "User not found",
      });
    } else if (bcrypt.compareSync(password, user.passwordHash)) {
     /*  console.log(req.session)
      req.session.currentUser = user; */
      res.redirect("/profile");
    } else {
      res.render("auth/login", { 
        errorMessage: "Incorrect password" });
    }
  })
  .catch(error => next(error));
});

// PROFILE
router.get("/profile", (req, res) => {
  res.render("user/user-profile");
});

module.exports = router;
