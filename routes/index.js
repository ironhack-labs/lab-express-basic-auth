const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const loginCheck = () => {
  return (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.redirect('/login');
    }
  }
}

router.get('/profile', loginCheck(), (req, res, next) => {
  const loggedInUser = req.session.user;
  res.render('profile', { user : loggedInUser })
})

router.get('/main', loginCheck(), (req, res, next) => {
  res.render('main')
})

router.get('/private', loginCheck(), (req, res, next) => {
  res.render('private')
})

module.exports = router;