const User = require("../models/User.model");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");

const MAX_AGE = 7; //7 días hasta que expire la sesión

module.exports.sessionConfig = expressSession({
  secret: "super-secret",
  resave: false, //por defalut es 'true', pero se esta empezando a setear como 'false'
  saveUninitialized: false, //por defalut es 'true', pero se esta empezando a setear como 'false'
  cookie: {
    secure: false, // lo vuelvo a 'true' una vez que lo suba a la nube
    httpOnly: true,
    maxAge: 24 * 3600 * 1000 * MAX_AGE, // está en milisegundos, por lo que este es el cálculo que se haría para pasarlo a días
  },
  store: new MongoStore({
    mongoUrl: "mongodb://localhost/lab-express-basic-auth", //para guardar las sesiones en la base de datos
  }),
});

module.exports.loggedUser = (req, res, next) => {
  const userId = req.session.userId; //para que identifique al usuario loggeado por su ID

  if (userId) {
    User.findById(userId)
      .then((user) => {
        if (user) {
          req.currentUser = user;
          res.locals.currentUser = user; //res.locals es el objeto dónde se manda información a todas las vistas (hbs)
          next();
        } else {
          next();
        }
      })
      .catch((err) => next(err));
  } else {
    next();
  }
};
