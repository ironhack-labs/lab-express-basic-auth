const router = require("express").Router();

/* GET home page */
router.get("/user", (req, res, next) => {
  res.render("user.hbs", { userInSession: req.session.currentUser });
});

module.exports = router;