const colors = require( 'colors' );
colors.setTheme( { log: 'bgBrightYellow' } );

const router = require( 'express' ).Router();
const User = require( '../models/User.model' );

router.get( '/admin/show-all-users', ( req, res, next ) => {
	const getAllUsers = async () => {
		const allUsers = await User.find();
		res.render( 'admin/show-all-users', { allUsers } );
	};
	getAllUsers();
} );

module.exports = router;