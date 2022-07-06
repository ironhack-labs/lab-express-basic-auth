const session = require('express-session');

const app = express();

module.exports = app =>{
    app.set('trust proxy', 1);

require('./config/sessiom.config') (app);

app.use(
    session({
        secret: process.env.SESS_SECRET,
        resave: true,
        saveUninitialized: false,
        cookie: {
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 6000
        }
    })
);
};