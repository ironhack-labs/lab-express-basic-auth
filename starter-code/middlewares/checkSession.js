exports.checkSession = (req, res, next) => {
	if (req.session.currentUser) {
		next();
	} else {
		res.redirect('/login');
	}
};
