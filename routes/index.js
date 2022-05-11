const { isLoggedIn } = require("../middleware/route-guard");

const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", { user: req.session.currentUser });
});

router.get("/private", isLoggedIn, (re, res, next) => {
  res.render("private");
});

router.get("/main", isLoggedIn, (re, res, next) => {
  res.render("main");
});

module.exports = router;
