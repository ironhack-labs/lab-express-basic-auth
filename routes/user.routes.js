const router = require("express").Router();

const { isLoggedIn } = require("./../middleware/route-guard");

router.get("/profile", isLoggedIn, (req, res, next) => {
  res.render("users/profile-page", { user: req.session.currentUser });
});

module.exports = router;
