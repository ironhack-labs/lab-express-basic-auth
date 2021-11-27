const router = require("express").Router();
const {
  getLogin,
  getSignup,
  signup,
  login,
  logout,
} = require("../controllers/auth.controllers");
const { isAnon, isLoggedIn } = require("../middlewares/auth.middlewares");

router
  .get("/signup", isAnon, getSignup)
  .get("/login", isAnon, getLogin)
  .post("/signup", isAnon, signup)
  .post("/login", isAnon, login)
  .post("/logout", isLoggedIn, logout);

module.exports = router;