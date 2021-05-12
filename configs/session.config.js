const session = require('express-session')

module.exports = app => {

    app.use(
        session({
            secret: process.env.SESS_SECRET,
            resave: true,
            saveUninitialized: false,
            cookie: {
                sameSite: true,
                httpOnly: true,
                maxAge: 120000
            }

        })
    )
}