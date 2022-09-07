const router = require("express").Router();

function loginCheck() {
  return (req, res, next) => {
    if (req.session.user !== undefined) {
      next()
    } else {
      res.redirect('/main')
      //res.redirect('/login')
    }
  }
}
/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/main', (req, res, next) => {
  res.render('main')
})


router.get('/profile', loginCheck(), (req, res, next) => {
  const username = req.session.user.username
  res.render('profile', { username: username })
});

module.exports = router;
