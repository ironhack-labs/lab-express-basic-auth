const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/members", (req, res, next) => {
  res.render("members");
});

module.exports = router;
