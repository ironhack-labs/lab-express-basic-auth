const router = require("express").Router();

const loginCheck = () => {
  return (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.redirect('login')
    }
  }
}

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/main', loginCheck(), (req, res, next) => {
  res.render('main');
})

router.get('/private', loginCheck(), (req, res, next) => {
  res.render('private');
})

module.exports = router;
