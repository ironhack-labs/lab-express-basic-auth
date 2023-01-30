const User = require ("../models/User.model");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");

const EXPIRE_DAYS = 7;

module.exports.sessionConfig = expressSession({
  secret: "PEPITO",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 3600 * 1000 * EXPIRE_DAYS
  },
  store: new MongoStore({
    mongoUrl: "mongodb://127.0.0.1:27017/lab-express-basic-auth",
  })
})

module.exports.loggerUser = (req, res,next) => {
  const userId = req.session.userId;

  if(userId){
    User.findById(userId)
    .then(user=>{
      if(user){
        req.currentUser = user
        res.locals.currentUser = user
        next()
      } else{
        next()
      }
    })
    .catch(err => next(err));
  } else {
    next()
  }
}