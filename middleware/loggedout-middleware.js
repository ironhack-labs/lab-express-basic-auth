function isLoggedOut(req, res, next) {
	if (!req.session.currentUser) {
		/* app.locals.isLoggedIn = false; */
		next();
	} else {
		res.redirect("/profile");
	}
}

module.exports = { isLoggedOut };
