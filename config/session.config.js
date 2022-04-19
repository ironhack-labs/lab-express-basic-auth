const { Store } = require('express-session');
const session = require('express-session')
const MongoStore = require('connect-mongo')

module.exports = app => {
    app.set('truty proxy', 1),
        app.use(
            session({
                secret: process.env.SESS_SECRET,
                resave: true,
                saveUninitialized: false,
                cookie: {
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                    secure: process.env.NODE_ENV === 'production',
                    httpOnly: true,
                    maxAge: 60000
                },
                store: MongoStore.create({
                    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost/userDB'

                })
            })
        )
}
