
const express = require('express');
//const app = express();
const router = express.Router();

const isLogged = (req, res, next) => {
	if (req.session.loggedInUser) next()
	else res.render('login', { message: "Nooo! You can't access this page without being logged in!"})
}

const setLoggedUser = (req, res, next) => {
	if (req.session.loggedInUser) res.locals.loggedUser = req.session.loggedInUser.username
	next()
}

// GET main (funnycat)
router.get("/main", isLogged, setLoggedUser, (req, res) => {
	res.render("funnycat")
});

// GET private (private)
router.get("/private", isLogged, setLoggedUser, (req, res) => {
	res.render("private")
});

// GET private (private)
router.get("/profile", isLogged, setLoggedUser, (req, res) => {
	let user = null
	user = req.session.loggedInUser ? req.session.loggedInUser : null
	res.render("userProfile", { user: user })
});

// GET index
router.get("/", setLoggedUser, (req, res) => {
  res.render("index")
});

module.exports = router;
