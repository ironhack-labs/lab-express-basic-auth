const session = require('express-session')

module.exports = app => {
    app.use(
        session({
            secret: process.env.SESS_SECRET,
            resave: false,
            saveUnitialized: true,
            cookie: { maxAge: 60000}
        })
    )
}