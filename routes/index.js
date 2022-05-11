const router = require("express").Router();
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", { user: req.session.currentUser });
});

router.get("/profile", (req, res, next) => {
  res.render("profile", { user: req.session.currentUser });
});

router.get("/main", isLoggedIn, (req, res, next) => {
  res.render("main");
});

router.get("/private", isLoggedIn, (req, res, next) => {
  res.render("private");
});

module.exports = router;
