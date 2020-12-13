require("dotenv").config();
const mongoose = require("mongoose");
const session = require("express-session");
const Mongostore = require("connect-mongo")(session);


const connectSession = (app) => {
    app.use(
        session(
            {
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: {maxAge: 60000},
            store: new Mongostore(
                {
                    mongooseConnection: mongoose.connection,
                    ttl:  60 * 60 * 24,
                }
            )
            }
        )
    )

}

module.exports = connectSession;