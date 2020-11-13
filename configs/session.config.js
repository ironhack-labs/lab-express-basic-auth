const mongoose = require('mongoose')
const session = require("express-session")
const MongoStore = require("connect-mongo")(session)

module.exports = app => {

    app.use(session({
        secret: "basic-auth-secret",
        cookie: { maxAge: 60000 },
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            ttl: 24 * 60 * 60 // 1 day
        })
    }));
}