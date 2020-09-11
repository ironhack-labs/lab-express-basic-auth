const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const mongoose = require('mongoose')


module.exports = app => {

    app.use(session({
        secret: "webmad0820-basic-auth",
        cookie: { maxAge: 60000 },
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            ttl: 24 * 60 * 60 // 1 day
        })
    }))

}