const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { isLoggedOut } = require("../middleware/routes-guard");

//Model
const User = require("../models/User.model");

router.get("/login", isLoggedOut, (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("login", { errorMsg: "You need to fill all inputs" });
  }

  const userFromDB = await User.findOne({ username });
  if (!userFromDB) {
    res.render("login", { errorMsg: "The user does not exist" });
  } else {
    const passwordsMatch = await bcrypt.compare(password, userFromDB.password);
    if (!passwordsMatch) {
      res.render("login", { errorMsg: "Incorrect password" });
    } else {
      req.session.loggedUser = userFromDB;
      res.redirect("/users/profile");
    }
  }
});

module.exports = router;
