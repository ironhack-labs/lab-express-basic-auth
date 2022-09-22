// config/session.config.js

const session = require('express-session');

// require mongostore
const MongoStore = require('connect-mongo');

//require  mongoose
const mongoose = require('mongoose');


// since we are going to use this middleware in the app.js,
// let's export it and have it receive  a parameter

module.exports  = function(app) {
    
    app.set('trust proxy', 1);



    // use session

app.use(
    session({
        secret: process.env.SESS_SECRET,
        resave: true,
        saveUninitialized: false,
        cookie:{
            sameSite: process.env.NODE_ENV ==='production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 300000  // 60 * 5,000 = 5 min
        }, 
        store: MongoStore.create( {
            mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost/lab-express-basic-auth'
        })
    })
)
};

