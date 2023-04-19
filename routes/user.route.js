const colors = require( 'colors' );
colors.setTheme( { log: 'bgBrightYellow' } );

const router = require( 'express' ).Router();
const User = require( '../models/User.model' );
const bcryptjs = require( 'bcryptjs' );

// on webpage visit
router.get( '/user/signup', ( req, res, next ) => {
	res.render( 'user/signup' );
} );

// on data submit
router.post( '/user/signup', ( req, res, next ) => {
	// read request
	const { username, password } = req.body;

	// validation
	// there was an input
	if ( username === '' && password === '' ) {
		res.render( 'user/signup', { message: 'fields cannot be empty' } );
		return;
	}
	// password requirements
	const pwLength = 4;
	if ( password.length < pwLength ) {
		res.render( 'user/signup', { message: 'password needs to have at least 4 characters' } );
		return;
	};

	// user already exists
	const doesUserExist = async () => {
		try {
			const dbUser = await User.findOne( { username } );
			if ( dbUser ) {
				res.render( 'user/signup', { message: 'username already exist' } );
			} else {
				signUpUser();
			}
		} catch ( err ) {
			next( err );
		}
	};
	doesUserExist();

	// sign up user
	const signUpUser = async () => {
		try {
			// hash pw
			const salt = await bcryptjs.genSaltSync( 10 );
			const hash = await bcryptjs.hashSync( password, salt );

			// create user
			await User.create( { username, password: hash } );

			// render page
			res.redirect( '/user/profile' );
		} catch ( err ) {
			next( err );
		}
	};
} );

// on webpage visit
router.get( '/user/login', ( req, res, next ) => {
	res.render( 'user/login' );
} );

// on data submit
router.post( '/user/login', ( req, res, next ) => {
	// read request
	const { username, password } = req.body;

	const loginUser = async () => {
		// find user in database
		const dbUser = await User.findOne( { username } );

		if ( dbUser ) {
			authenticate( dbUser.password );
		} else {
			res.render( 'user/login', { message: 'wrong credentials' } );
		}
	};
	loginUser();

	// compare password and hash
	const authenticate = async ( hash ) => {
		if ( bcryptjs.compareSync( password, hash ) ) {
			res.redirect( '/user/profile' );
		} else {
			res.render( 'user/login', { message: 'wrong credentials' } );
		}
	};
} );

module.exports = router;
