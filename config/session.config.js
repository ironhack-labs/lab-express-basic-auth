const session = require('express-session');
const MongoStore = require('connect-mongo');

module.exports = app => {
    app.set('trust proxy', 1);
    app.use(
        session({
            secret: process.env.SESSION_SECRET, // String value used to sign session cookies
            resave: true, 
            saveUninitialized: false, 
            cookie: {
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                maxAge: 60000 // 1 min
            },
            // Save the session in the Database (sessions collection)
            store: MongoStore.create({
                mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1/user-auth'
            })
        })
    );
};