const session = require('express-session');

const MongoStore = require('connect-mongo');

const mongoose = require('mongoose');

module.exports = app =>{
// good when you have your app deployed
app.set('trust proxy', 1);

app.use(
    session({
        secret: process.env.SESS_SECRET, 
        resave: true, 
        saveUninintialized: false, 
        cookie: {
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production', 
            httpOnly: true, 
            maxAge: 60000 // 60 000  ms that is equal to 1 minute  
        }, 
        store: MongoStore.create({
            mongoUrl: 'mongodb://127.0.0.1:27017/basic-auth'
        })   
    })
)
}