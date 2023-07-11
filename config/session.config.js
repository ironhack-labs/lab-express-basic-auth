const session = require('express-session');
const MongoStore = require ('connect-mongo');

module.exports = app => {
    app.set('trust proxy', 1);

    app.use(
        session({
            secret: process.env.SESS_SECRET,
            resave: true,
            saveUnitialized: true,
            cookie: {
                // sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                // secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                maxAge: 600000 // 60 * 10000 ms === 10 min
            },
            store: MongoStore.create({
                mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lab-express-basic-auth'
            })
        })
    );
};