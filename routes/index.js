const router = require("express").Router();
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/profile", isLoggedIn, (req, res, next) => {
  res.render("profile", { user: req.session.currentUser });
});

module.exports = router;
