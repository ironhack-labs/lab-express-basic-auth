const colors = require( 'colors' );
colors.setTheme( { log: 'bgBrightYellow' } );

const router = require( 'express' ).Router();

/* GET home page */
router.get( '/', ( req, res, next ) => {
	res.render( 'index' );
} );

module.exports = router;
