const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username === "" || password === "") {
      res.render("/signup", { error: "all fields required" });
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
  res.render("user/userprofile");
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", async (req, res) => {
  console.log("SESSION =====> ", req.session);
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
    console.log(password, hashedPassword);
    if (!comparePasswords) {
      res.render("auth/login", { error: "password is very wrong" });
      return;
    }
    req.session.currentUser = foundUser;
    res.redirect("/userprofile");

    console.log(foundUser);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
