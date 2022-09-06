const router = require("express").Router();
const isLogedin = require('../middleware/is_logedin.middleware');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/profile', isLogedin, (req, res) => {
  const user = req.session.user;
  res.render('profile', user);
})

module.exports = router;
