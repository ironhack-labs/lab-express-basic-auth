const router = require("express").Router()
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")

const saltRounds = 10;

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("signup", { errorMessage: "Username and password are required" });
    return;
  }

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({ username, password: hashedPassword });
    res.redirect("/");
  } catch (err) {
    if (err.code === 11000) {
      res.render("signup", { errorMessage: "Username already exists" });
    } else {
      next(err);
    }
  }
});


router.get("/login", (req, res, next) => {
    res.render("login");
  });
  
  router.post("/login", async (req, res, next) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      res.render("login", { errorMessage: "Username and password are required" });
      return;
    }
  
    try {
      const user = await User.findOne({ username });
      if (!user) {
        res.render("login", { errorMessage: "Invalid login credentials" });
        return;
      }
  
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        res.render("login", { errorMessage: "Invalid login credentials" });
        return;
      }
  
      req.session.currentUser = user;
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  });

module.exports = router;
