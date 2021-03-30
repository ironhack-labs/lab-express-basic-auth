const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

module.exports = app => {
    app.use(
        session({
            secret: 'alalalla',
            resave: true,
            rolling: true,
            saveUninitialized: false,
            cookie: {
                path: '/',
                sameSite: false,
                httpOnly: true,
                maxAge: 60 * 60 * 24
            },
            store: MongoStore.create({
                mongoUrl: 'mongodb://localhost/express-basic-auth-dev',

                ttl: 60 * 60 * 24,
            })
        })
    );
}
