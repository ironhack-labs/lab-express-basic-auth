const isLoggedIn = require("../middlewares/isLoggedin");

const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/profile", isLoggedIn, (req, res) => {
  res.render("auth/profile");
});

module.exports = router;
