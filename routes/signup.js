const router = require("express").Router();

//require user model
const User = require("../models/User.model");

//require bscryptjs
const bcrypt = require("bcryptjs");

//set salt rounds
const saltRounds = 12;

router.get("/signup", (req, res, next) => {
  res.render("createAccount");
});

router.post("/signup", async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!password) {
    console.log("Please enter a password");
    return res.render("createAccount", {
      error: "Please enter a password",
    });
  }

  if (!email) {
    console.log("Please enter an email address");
    return res.render("createAccount", {
      error: "Please enter an email address",
    });
  }

  const salt = await bcrypt.genSalt(saltRounds);
  console.log(salt);

  const hash = bcrypt.hashSync(password, salt);
  console.log(hash);

  const newUser = new User({ email, password: hash });

  await newUser.save();
  res.render("profile");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email });

  if (!existingUser) {
    console.log("No matching email");
    return res.render("login", {
      error: "Please sign up first",
    });
  }

  const correctPw = await bcrypt.compare(req.body.password, existingUser.password);

  if (!correctPw) {
    return res.render("login", {
      error: "We cannot log you in due to an error. Please try again next week.",
    });
  }

  req.session.currentUser = {
    email: existingUser.email,
  };

  return res.redirect("/profile");
});

//logged in function from Rico
function ensureUserIsLoggedIn(req, res, next) {
  if (!req.session.currentUser) {
    return res.redirect("/login");
  }

  next();
}

router.get("/profile", ensureUserIsLoggedIn, async (req, res) => {
  const user = await User.findOne({ email: req.session.currentUser.email });

  res.render("profile", { user: user.email });
});

router.get("/private", ensureUserIsLoggedIn, async (req, res) => {
  res.render("secret");
});

module.exports = router;
