const router = require("express").Router();
const isLogged = require('../middleware/is_logged.middleware');
/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/profile', isLogged, (req, res) => {
  const user = req.session.user;
  res.render('profile', user);
})


module.exports = router;
