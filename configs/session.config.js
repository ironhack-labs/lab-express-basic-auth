const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");

module.exports = (app) => {
	app.use(
		session({
			secret: process.env.SESS_SECRET,
			resave: false,
			saveUninitialized: true,
			cookie: { maxAge: 60000 },
			store: new MongoStore({
				mongooseConnection: mongoose.connection,
				ttl: 60 * 60 * 24, 
			}),
		})
	);
};


// The sessions will expire when the cookie expires if you set the expiration date of a cookie. If you didn’t set maxAge property on a cookie, then the expiration date will be determined by ttl.