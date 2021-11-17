const router = require("express").Router();
const isLoggedin = require("./../middleware/isLoggedin");

router.get("/secret", isLoggedin, (req, res) => {
  res.render("secret");
});

module.exports = router;
