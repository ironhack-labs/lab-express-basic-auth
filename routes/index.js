const router = require("express").Router();
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", { user: req.session.currentUser });
});

router.get("/main", (req, res, next) => {
  res.render("main");
});

router.get("/private", isLoggedIn, (req, res, next) => {
  res.render("private", { user: req.session.currentUser });
});

module.exports = router;
