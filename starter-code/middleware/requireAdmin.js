module.exports = function(roles) {
	return function(req, res, next) {
		if (roles.includes(req.session.user.role)) {
			next();
		} else {
			res.redirect('/');
		}
	};
};
