function isLoggedIn(req, res, next) {
	if (req.session.currentUser) {
		/* app.locals.isLoggedIn = true; */
		next();
	} else {
		res.render("auth/login", { errorMessage: "Login to access." });
	}
}

module.exports = { isLoggedIn };
