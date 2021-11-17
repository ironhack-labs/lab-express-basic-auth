const router = require("express").Router();

function isUserLoggedIn(req, res, next) {
	if (req.session.loggedInUser) next()
	else res.redirect('/auth/login')
}

/* GET home page */
router.get("/", isUserLoggedIn, (req, res, next) => {
  res.render("index")
});

module.exports = router;
