const isLoggedIn = ( req, res, next ) => {
	if ( !req.session.sessionUser ) {
		return res.redirect( '/user/login' );
	}
	next();
};

module.exports = isLoggedIn;
