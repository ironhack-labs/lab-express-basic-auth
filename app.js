// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require( 'dotenv/config' );

// ℹ️ Connects to the database
require( './db' );

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require( 'express' );

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require( 'hbs' );
hbs.registerHelper( 'ifeq', function( a, b, options ) {
	return ( a === b ) ? options.fn( this ) : options.inverse( this );
} );

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require( './config' )( app );

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice( 1 ).toLowerCase();

app.locals.title = `${capitalized( projectName )}- Generated with Ironlauncher`;

// configure session
const session = require( 'express-session' );
const MongoStore = require( 'connect-mongo' );
app.use( session(
	{
		secret: process.env.SESSION_SECRET,
		cookie: { maxAge: 1000 * 60 * 5 }, // 10min
		resave: true,
		saveUninitialized: true,
		store: MongoStore.create( {
			mongoUrl: process.env.MONGODB_URI,
		} ),
	},
) );

// 👇 Start handling routes here
const index = require( './routes/index.route' );
app.use( '/', index );

const user = require( './routes/user.route' );
app.use( '/', user );

const profile = require( './routes/profile.route' );
app.use( '/', profile );

const admin = require( './routes/admin.route' );
app.use( '/', admin );

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require( './error-handling' )( app );

module.exports = app;

