const router = require("express").Router();
const { isLoggedIn } = require("../middleware/route-guard");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/profile", isLoggedIn, (req, res, next) => {
  const user = req.session.user;
  res.render("profile", { user: user });
});

router.get("/main", isLoggedIn, (req, res, next) => {
  const user = req.session.user;
  res.render("main", { user: user });
});

router.get("/private", isLoggedIn, (req, res, next) => {
  const user = req.session.user;
  res.render("private", { user: user });
});

module.exports = router;
