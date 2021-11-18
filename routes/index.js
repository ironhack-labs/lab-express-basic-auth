const router = require("express").Router();
const {isLoggedIn} = require("../middleware/route-guard")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

/* GET main page */
router.get("/main", isLoggedIn, (req, res, next) => {
  res.render("main.hbs");
});

/* GET private page */
router.get("/private", isLoggedIn, (req, res, next) => {
  res.render("private.hbs");
});

module.exports = router;
