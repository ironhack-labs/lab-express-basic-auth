const session = require("express-session");
const MongoStore = require("connect-mongo")(session); //Esto es function(connect) donde connect es session
const mongoose = require("mongoose");
require("dotenv").config();

const connectSession = app => {
    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave:false,
            saveUninitialized:true,
            cookie:{ maxAge: 60000 },//El tiempo que tarda en morir la cookie
            store: new MongoStore({
                mongooseConnection: mongoose.connection,
                // time to live " la sesion en mongo "
                ttl: 60 * 60 * 24,
            }),
        })
    )
}

module.exports = connectSession;