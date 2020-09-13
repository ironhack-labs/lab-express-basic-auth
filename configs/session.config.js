const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const mongoose = require('mongoose')


module.exports = app => {

    app.use(session({
        secret: "express-basic-auth",
        cookie: { maxAge: 0 },
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            ttl: 24 * 60 * 60 // 1 day
        })
        
    }))

}