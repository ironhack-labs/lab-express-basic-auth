const User = require("../models/User.model")
const expressSession = require('express-session');
const MongoStore = require('connect-mongo');

const MAX_AGE = 7;

module.exports.sessionConfig = expressSession({
  secret: 'super-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 3600 * 1000 * MAX_AGE 
  },
  store: new MongoStore({
    mongoUrl: 'mongodb://localhost/lab-express-basic-auth',
  })
})

module.exports.loggedUser = (req, res, next) => {
  
  const userId = req.session.userId;

  if (userId) {
    User.findById(userId)
      .then(user => {
        if (user) {
          req.currentUser = user
          res.locals.currentUser = user // res.locals es el objeto donde se manda informacion a todas las vistas (hbs)
          next()
        } else {
          next()
        }
      })
      .catch(err => next(err));
  } else {
    next()
  }
}
