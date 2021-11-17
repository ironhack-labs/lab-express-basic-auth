const router = require("express").Router();
const userLoggedIn = require("./../middleware/login-confirmation")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/main", userLoggedIn, (req, res) => {
  res.render("main-page");
})

router.get("/private", userLoggedIn, (req, res) => {
  res.render("secret-page");
})

module.exports = router;
