const session = require('express-session');

module.exports = app => {
    app.use(
        session({
            secret: 'thisIsASession',
            resave: false,
            saveUninitialized: true,
            cookie: { maxAge: 120000 },
        })
    );
};