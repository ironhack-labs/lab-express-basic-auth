const colors = require( 'colors' );
colors.setTheme( { log: 'bgBrightYellow' } );

const router = require( 'express' ).Router();
const isLoggedIn = require( '../middleware/isLoggedIn.js' );

// on webpage visit
router.get( '/user/profile', isLoggedIn, ( req, res, next ) => {
	const userName = req.session.user.username;
	const userRole = req.session.user.role;
	res.render( 'user/profile', { userName, userRole } );
} );

module.exports = router;
