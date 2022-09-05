const isLogedin = require("../middleware/is_logedin.middleware");

const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/profile', isLogedin, (req, res) => {
  const user = req.session.user;
  res.render('profile', user);
})


module.exports = router;
