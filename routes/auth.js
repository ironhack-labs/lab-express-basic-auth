const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { isLoggedOut } = require("../middleware/route-guard");
const { isLoggedIn } = require("../middleware/route-guard");
const User = require("../models/User.model");

router.get("/signup", (req, res) => {
  res.render("createUser");
});
router.get("/login", isLoggedOut, (req, res) => {
  res.render("login");
});

router.post("/signup", isLoggedOut, async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render("createUser", {
      errorMsg: "You need to enter a valid username and password",
    });
  }
  const userFromDB = await User.findOne({ username });
  if (userFromDB) {
    return res.render("createUser", {
      errorMsg: "This username already exists",
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await User.create({
      username,
      password: hashedPassword,
    });
    res.render("createUser.hbs", { justCreatedUser: createdUser.username });
  } catch (error) {
    console.log(error);
  }
});
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.render("login", { errorMsg: "You need to fill all inputs" });
  }
  const userFromDB = await User.findOne({ username });
  if (!userFromDB) {
    res.render("login", { errorMsg: "The user does not exist" });
  } else {
    const passwordMatch = await bcrypt.compare(password, userFromDB.password);
    if (!passwordMatch) {
      res.render("login", { errorMsg: "Incorrect password" });
    } else {
      req.session.loggedUser = userFromDB;
      res.redirect("/main");
    }
  }
});
router.post("/logout", isLoggedIn, async (req, res, next) => {
  res.clearCookie("connect.sid", { path: "/" });

  try {
    await req.session.destroy();
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});
module.exports = router;
