const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");
const router = require("express").Router();
const saltRounds = 12;

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

router.post("/login", async (req, res) => {
  console.log(req.body);

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

  // console.log("correct password!");
  // req.session.currentUser = {
  //   email: existingUser.email,
  //   subscribed: existingUser.subscribed,
  // };
  return res.redirect("/profile");
});

module.exports = router;
