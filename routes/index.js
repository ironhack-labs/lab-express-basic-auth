const router = require("express").Router();
const { isAuth } = require("../middleware/route-guard");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/main", isAuth, (req, res, next) => {
  res.render("main");
});

router.get("/private", isAuth, (req, res, next) => {
  res.render("private");
});

module.exports = router;
