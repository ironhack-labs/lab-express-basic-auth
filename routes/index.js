const router = require("express").Router();
const { isLoggedIn } = require("../middleware/route-guard");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/private", isLoggedIn, (req, res) => {
  const { username } = req.session.loggedUser;
  res.render("private");
});
router.get("/main", isLoggedIn, (req, res) => {
  const { username } = req.session.loggedUser;
  res.render("main");
});

module.exports = router;