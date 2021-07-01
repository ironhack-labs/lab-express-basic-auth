const session = require("express-session");
const MongoStore = require("connect-mongo");
const DB_NAME = "demo-register";
const URI = "mongodb://localhost:27017";

module.exports = (app) => {
    app.use(session({
        secret: process.env.SESSION_SECRET || "super secret",
        resave: true,
        saveUninitialized: false,
        cookie: {
            sameSite: process.env.SESSION_SAME_SITE || "lax",
            httpOnly: true,
            maxAge: 1000 * 60 * 60,
            secure: process.env.SESSION_SECURE || false
        },
        store: MongoStore.create({
            mongoUrl: `${URI}/${DB_NAME}`,
        })        
    }))
}