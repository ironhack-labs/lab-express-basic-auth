const router = require("express").Router();
const User = require("../models/User.model")
const bcryptjs = require("bcryptjs")

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
  
  // hashing password
  const saltRounds = 10
  const salt = await bcryptjs.genSalt(saltRounds)
  hashedPasswort = await bcryptjs.hash(password, salt)

  //create user with hashed password
  await User.create({"username": username, "password": hashedPasswort})
  res.render("login");
});
router.post("/login", async (req, res, next) => {
  res.redirect("private");
});



module.exports = router;
