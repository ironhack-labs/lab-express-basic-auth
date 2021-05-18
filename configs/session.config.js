const session = require('express-session');
const MongoStore = require('connect-mongo');

module.exports = (app) => {
    app.use(session({
        secret: process.env.SESS_SECRET,
        resave: true,
        saveUninitialized: false,
        cookie: {
            sameSite: 'none',
            httpOnly: true,
            maxAge: 60000
        },
        store: MongoStore.create({
            mongoUrl: 'mongodb://localhost/express-basic-auth-dev',
            ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
        })
    }));
};