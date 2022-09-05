const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/profile', (req, res, next) => {
  console.log(req.session.user)
  res.render('profile', req.session.user)
})

module.exports = router;
