const router = require("express").Router();

const { isLoggedOut, isLoggedIn } = require('./../middleware/route-guard')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/main", isLoggedIn, (req, res) => {
  res.render("main")
})

router.get("/private", isLoggedIn, (req, res) => {
  res.render("private")
})

module.exports = router;
