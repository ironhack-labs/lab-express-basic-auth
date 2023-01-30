//require session
const session = require('express-session');

module.exports = app => {
    app.use(
        session({
        secret: process.env.SESS_SECRET,
        resave: true,
        saveUninitialized: false,
        cookie: {
            sameSite: 'none',
            httpOnly: true,
            maxAge: 60000 // 60 * 1000 ms === 1 min
        }
        })
    );
};