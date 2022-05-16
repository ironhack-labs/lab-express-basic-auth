const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.use('/auth', require('./auth.routes'));
router.use('/profile', require('./profile.routes'));
module.exports = router;

