const router = require("express").Router();
const { isLoggedIn } = require('./../middleware/route-guard')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/profile", isLoggedIn, (req, res, next) => {
  res.render("user/profile", { user: req.session.currentUser })
})

router.get("/main", isLoggedIn, (req, res, next) => {
  res.render("user/main", { user: req.session.currentUser })
})

module.exports = router;
