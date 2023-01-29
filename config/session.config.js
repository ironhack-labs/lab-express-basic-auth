const User = require ("../models/User.model");
const expressSession = require ("express-session");
const MongoStore = require ("connect-mongo");

const MAX_AGE = 7; // cuanto durán las cookies

module.exports.sessionConfig = expressSession ({
    secret: "super-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true, 
        maxAge: 24 * 3600 * 1000 * MAX_AGE // max Age 2023-05-02  24h* 3600 seg* 1000miliseg _ esto se calcula en milisegundos
    },
    store: new MongoStore ({
        mongoUrl: 'mongodb://127.0.0.1:27017/demo-auth-ih',
    // ttl: 24 * 3600 * MAX_AGE
    })
})

module.exports.loggedUser = (req,res,next) => {
    const userId = req.session.userId;

    if (userId) {
        User.findById(userId)
        .then(user => {
            if (user) {
                req.currentUser = user
                res.locals.currentUser = user //res.locals es el objeto donde se manda informacion a todas las vistas (hbs)
                next ()
            } else {
                next()
            }
        })
        .catch(err => next(err));
  } else {
    next()
  }
}