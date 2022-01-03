const session = require("express-session");
const MongoStore = require("conect-mongo");
const mongoose = require("mongoose");

module.exports = app => {
app.set("trust proxy", 1);

app.use(
    session({
        secret: process.env.SESS_SECRET,
        resave: true,
        saveUnitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60000 * 60
        },
        store: MongoStore.create({
            mongoUrl:
            process.env.MONGODB_URI || "mongodb://localhost/lab-express-basic-auth",
        })
    })
)
}

