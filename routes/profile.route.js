const colors = require( 'colors' );
colors.setTheme( { log: 'bgBrightYellow' } );

const router = require( 'express' ).Router();
const User = require( '../models/User.model' );

// on webpage visit
router.get( '/user/profile', ( req, res, next ) => {
	const username = 'Username';
	res.render( 'user/profile', { username } );
} );

module.exports = router;
