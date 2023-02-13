const router = require("express").Router();

const { isLoggedIn } = require('./../middlewares/route-guards')

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/main', isLoggedIn, (req, res) => {
  res.render('main')
})

router.get('/private', isLoggedIn, (req, res) => {
  res.render('private', { user: req.session.currentUser })
})

module.exports = router;
