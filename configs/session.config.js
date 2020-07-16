const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
const mongoose = require('mongoose');
const MongoStore = connectMongo(expressSession);

const session = expressSession({
    secret: process.env.SESS_SECRET,
    resave: false,
    salveUnitialized: true,
    cookie: {
        maxAge: 60000
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 60
    })
});

module.exports = session;