const expressSession = require("express-session")
const connectMongo = require("connect-mongo")
const mongoose = require("mongoose")

const MongoStore = connectMongo(expressSession)

const session = expressSession({
    session: process.env.SESSION_SECRET || "Super secret",
    saveUninitialized: false,
    resave: false,
    cookie:{
        secure: process.env.SESSION_SECURE|| false,
        httpOnly: true,
        maxAge: process.env.SESSION_MAX_AGE || 3600000
    },  
    store:{
        mongooseConnection: new MongoStore({

        })
    }

})

module.exports = session