const router = require("express").Router();
const { isGuest } = require("../middlewares/auth.middleware");
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const findUserName = await User.findOne({ username });
    console.log("findusername", findUserName);

    if (username === "" || password === "") {
      res.render("auth/signup", { error: "all fields required" });
    } else if (findUserName) {
      res.render("auth/signup", { error: "usernameis already exist" });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const createUser = await User.create({
      username,
      password: hashedPassword,
    });

    res.redirect("/login");

    //!error handling necessary
    //*check for database if the user exist you already have account// we made the field unique
    //*check if user not exist hash the password and create
  } catch (err) {
    console.log("error");
  }
});

router.get("/userprofile", (req, res) => {
  res.render("user/userprofile", { userInSession: req.session.currentUser });
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.render("auth/login", { error: "all fields are required" });
  }
  try {
    const foundUser = await User.findOne({ username });
    if (!foundUser) {
      res.render("auth/login", { error: "user is not found" });
    }
    const { password: hashedPassword } = foundUser;
    const comparePasswords = await bcrypt.compare(password, hashedPassword);
    if (!comparePasswords) {
      res.render("auth/login", { error: "password is very wrong" });
      return;
    } else {
      req.session.currentUser = foundUser;
      res.redirect("/userprofile");
    }

    console.log(foundUser);
  } catch (err) {
    console.log(err);
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect("/login");
});

router.get("/main", (req, res) => {
  res.render("user/main");
});

router.get("/private", isGuest, (req, res) => {
  res.render("user/private");
});

module.exports = router;
