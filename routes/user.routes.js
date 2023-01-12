const router = require("express").Router();

router.get("/profile", (req, res) => {
  res.render("user/user-profile");
});

module.exports = router;
