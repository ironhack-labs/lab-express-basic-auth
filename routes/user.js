const router = require("express").Router();
const requireAuth = require('../middlewares/authVerification')

/* GET home page */
router.get("/user", requireAuth, (req, res, next) => {
  res.render("user.hbs", { userInSession: req.session.currentUser });
});

module.exports = router;    