const router = require("express").Router();

router.get("/main", (req, res) => {
  res.render("main");
});

module.exports = router;
