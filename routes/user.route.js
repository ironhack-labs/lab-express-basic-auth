const colors = require( 'colors' );
colors.setTheme( { log: 'bgBrightYellow' } );

const router = require( 'express' ).Router();
const User = require( '../models/User.model' );
const bcryptjs = require( 'bcryptjs' );

// NOTE: signup
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
			// find user in database
			const dbUser = await User.findOne( { username } );

			// if already in database, throw error
			// otherwise, signup
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
			// hash pw: [ .hashSync() = synchronous, .has() = asynchronous ]
			// for salting, it might be better to use async with a promise, since this operation might take a while
			const salt = await bcryptjs.genSaltSync( 10 );
			const hash = await bcryptjs.hashSync( password, salt );

			// create user
			await User.create( { username, password: hash } );

			// after user created, create a session for them...
			createSession();

			// ...so we can render the welcome page...
			// ...and after the profile page (already logged in)
			res.render( 'user/welcome', { username } );
		} catch ( err ) {
			next( err );
		}
	};

	// create session to track login
	const createSession = async () => {
		try {
			// find user in database
			const dbUser = await User.findOne( { username } );

			// add a new property (user) to the session object
			const sessionUser = {
				_id: dbUser._id,
				username: dbUser.username,
				role: dbUser.role,
			};
			req.session.sessionUser = sessionUser;
		} catch ( err ) {
			next( err );
		}
	};
} );

// NOTE: login
// on webpage visit
router.get( '/user/login', ( req, res, next ) => {
	res.render( 'user/login' );
} );

// on data submit
router.post( '/user/login', ( req, res, next ) => {
	// read request
	const { username, password } = req.body;

	const loginUser = async () => {
		try {
			// find user in database
			const dbUser = await User.findOne( { username } );

			if ( dbUser ) {
				authenticate( dbUser );
			} else {
				res.render( 'user/login', { message: 'wrong credentials' } );
			}
		} catch ( err ) {
			next( err );
		}
	};
	loginUser();

	// compare password and hash
	const authenticate = ( dbUser ) => {
		if ( bcryptjs.compareSync( password, dbUser.password ) ) {
			createSession( dbUser );
			res.redirect( '/user/profile' );
		} else {
			res.render( 'user/login', { message: 'wrong credentials' } );
		}
	};

	// create session to track login
	const createSession = ( dbUser ) => {
		// add a new property (user) to the session object
		const sessionUser = {
			_id: dbUser._id,
			username: dbUser.username,
			role: dbUser.role,
		};
		req.session.sessionUser = sessionUser;
	};
} );

// NOTE: logout
router.get( '/user/logout', ( req, res, next ) => {
	// kill session
	req.session.destroy();
	res.render( 'user/logout' );
} );

module.exports = router;
