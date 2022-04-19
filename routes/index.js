const { isLoggedIn } = require("../middleware/route-guard");

const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/main", isLoggedIn, (req, res, next) => {
  res.render("main", { user: req.session.currentUser });
});

router.get("/private", isLoggedIn, (req, res, next) => {
  res.render("private", { user: req.session.currentUser });
});

module.exports = router;
