const router = require("express").Router();
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", { user: req.session.currentUser });
});

router.get("/catz", (req, res, next) => {
  if (!req.session.currentUser) {
    res.render("main");
  } else {
    res.render("private", { user: req.session.currentUser });
  }
});

module.exports = router;
