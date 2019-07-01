const express = require("express");
const router = express.Router();
const {
  getSignup,
  postSignup,
  getLogin,
  postLogin
} = require("../controllers/auth.controllers");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
router.get("/signup", getSignup);
router.post("/signup", postSignup);
router.get("/login", getLogin);
router.post("/login", postLogin);

module.exports = router;
