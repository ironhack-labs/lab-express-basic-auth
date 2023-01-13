const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Basic Auth" });
});

module.exports = router;
