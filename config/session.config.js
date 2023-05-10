// Session configurations 

// require express session 
const session = require('express-session');

const MongoStore = require('connect-mongo');


module.exports = (app) =>{

    // Security Mediator
    // Deploy  
    app.set('trust proxy', 1);

    app.use(
        session({
            secret: process.env.SESS_SECRET,
            resave: true, 
            saveUninitialized:  false,
            cookie: {
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // ternary operators --> make conditions
                secure: process.env.NODE_ENV === 'production', // https instead http
                httpOnly: true, 
            }, 
            store: MongoStore.create({
                mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost/lab-express-basic-auth',
                ttl: 60*60*24
            })
        })
    )
}