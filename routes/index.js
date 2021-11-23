const router = require("express").Router();
const User = require("../models/User.model")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
router.get("/login", (req, res, next) => {
  res.render("login");
});
router.get("/signup", (req, res, next) => {
  res.render("signup");
});


router.post("/signup", async (req, res, next) => {
  const {username, password} = req.body
  await User.create({"username": username, "password": password})
  res.render("login");
});
router.post("/login", async (req, res, next) => {
  res.redirect("private");
});



module.exports = router;
