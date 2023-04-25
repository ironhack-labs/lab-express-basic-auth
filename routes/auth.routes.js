const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");
const router = require("express").Router();
const saltRounds = 12;
const isLoggedIn = require("../middlewares/isLoggedin");

// signup routes
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res, next) => {
  // const{email,password} = req.body;

  const salt = await bcryptjs.genSalt(saltRounds);
  console.log(salt);

  const hash = await bcryptjs.hash(req.body.password, salt);
  console.log(hash);

  const newUser = new User({ username: req.body.username, password: hash });
  console.log(newUser);
  await newUser.save();
  res.redirect("/profile");
});

// router.get("/profile", (req, res) => {
//   res.render("auth/profile");
// });

// login routes
router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", async (req, res, next) => {
  console.log(req.body);
  try {
    const existingUser = await User.findOne({ username: req.body.username });

    if (!existingUser) {
      console.log("Failed to find user with that username");
      return res.render("auth/login", {
        error: "Failed to find user with that username, Sign up first please!",
      });
    }

    const passwordIsCorrect = await bcryptjs.compare(
      req.body.password,
      existingUser.password
    );

    if (!passwordIsCorrect) {
      console.log("wrong password");
      return res.render("auth/login", {
        error: "There was an error logging in!",
      });
    }
    // save the user in the session
    console.log("correct password!");
    req.session.currentUser = {
      username: existingUser.username,
    };
    return res.redirect("/profile");
  } catch (err) {
    next(err);
  }
});

router.get("/main", isLoggedIn, (req, res, next) => {
  res.render("auth/main");
});

router.get("/private", isLoggedIn, (req, res, next) => {
  res.render("auth/private");
});

module.exports = router;
