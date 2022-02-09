const session        = require("express-session")
const MongoStore     = require("connect-mongo")

const sessionManager = (application) => {

    application.set("trust proxy", 1)

    application.use(session({
        secret: process.env.SECRET,
        resave: true,
        cookie: {
            maxAge: 8640000,
            httpOnly: true, 
        },
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI
        })
    }))
}

module.exports = sessionManager