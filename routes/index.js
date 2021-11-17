const router = require("express").Router();
const isLoggedIn = require("./../middleware/isLoggedIn");

/* GET home page */
router.get("/", (req, res) => {
  res.render("index");
});

router.get("/main", isLoggedIn, (req, res) => {
  res.render("main");
});

router.get("/private", isLoggedIn, (req, res) => {
  res.render("private");
});
module.exports = router;
