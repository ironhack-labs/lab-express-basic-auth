const isLoggedIn = (req, res, next) => {
	if (req.session.currentUser) {
		return next()
	} else {
		return res.redirect("/signin")
	}
}

module.exports = isLoggedIn