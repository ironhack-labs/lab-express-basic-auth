const router = require("express").Router();

/* GET private page */
router.get("/private", (req, res, next) => {
  res.render("private");
});

module.exports = router;
