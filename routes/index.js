const router = require("express").Router();

function loginCheck() {
  return (req, res, next) => {
    // check if the user is logged in
    if (req.session.user !== undefined) {
      // the user is logged in 
      // they can visit the page that they requested
      next()
    } else {
      // the user is not logged in
      // we redirect
      res.redirect('/auth/login')
    }
  }
}

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


router.get('/main', loginCheck(), (req, res, next) => {
  const username = req.session.user.username
  res.render('main', { username: username })
});

router.get('/private', loginCheck(), (req, res, next) => {
  const username = req.session.user.username
  res.render('private', { username: username })
});


module.exports = router;
