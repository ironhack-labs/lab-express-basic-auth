const router = require("express").Router();
const Model = require("../models/User.model")

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

router.post("/login", (req, res, next) => {
  res.render("login");
});
router.post("/signup", (req, res, next) => {
  res.render("signup");
});



module.exports = router;
