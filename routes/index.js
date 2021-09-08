const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/profile', (req, res, next) => {
  const loggedInUser = req.session.user;
  console.log(loggedInUser)
  res.render('profile', { user : loggedInUser })
})

module.exports = router;