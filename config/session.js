const session = require('express-session');
const MongoStore = require('connect-mongo');

const sessionManager = (application) => {
    console.log('Session manager activo');
    application.set('trust proxy', 1);
    application.use(session({
        secret:"NEURALSCIENCE",
        resave: true,
        cookie:{
            maxAge: 86400000,
            httpOnly: true
        },
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI
        })
    }))
}
module.exports = sessionManager