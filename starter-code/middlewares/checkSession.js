exports.checkSession = (req, res, next) => {
	console.log(req.session.currentUser);
	// if (req.session.currentUser) {
	// 	next();
	// } else {
	// 	res.redirect('/login');
	// }
	next();
};
