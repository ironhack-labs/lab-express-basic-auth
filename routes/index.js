const router = require("express").Router();
const { isLoggedIn } = require('../middleware/route-guards');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/profile', isLoggedIn, (req, res, next) => {
  const user = req.session.user;
  res.render('profile', { user });
});

module.exports = router;
