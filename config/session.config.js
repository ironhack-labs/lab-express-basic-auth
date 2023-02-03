const User = require('../models/User.model')
const expressSession = require('express-session');
const MongoStore = require('connect-mongo');

const MAX_AGE = 7;


module.exports.sessionConfig = expressSession({
    secret: 'super-secret',//utiliza para encryptar y da un chorizo sin sentido
    resave: false,//si queremos guardar o no los datos
    saveUninitialized: false,
    cookie: {
      secure: false,//es para que sean legibles desde hptt//
      httpOnly: true,//solo sea legible desde hptt, pero no desde chrome
      maxAge: 24 * 3600 * 1000 * MAX_AGE // maxAge: 2023-05-02. cuanto tiempo va durar la cocki-sesion
    },
    store: new MongoStore({//donde vamos a guardar las sesiones.en mongo
      mongoUrl: 'mongodb://127.0.0.1:27017/demo-auth-ih',//hay que ver sino se destruye
      // ttl: 24 * 3600 * MAX_AGE
    })
  });

  module.exports.loggedUser = (req, res, next) => {// si encuentra en mongo hace todo esto...mete los libros y etc
    const userId = req.session.userId;
  
    if (userId) {
      User.findById(userId)
        // .populate('books')
        .populate(
          {
            path: 'books',
            populate: {
              path: 'user'
            }
          }
        )
        .then(user => {
          if (user) {
            req.currentUser = user//esto es para que el usuario  esté disponible en todas rutas/controladores
            res.locals.currentUser = user // res.locals es el objeto donde se manda informacion a todas las vistas (hbs)
            next()//siempre se va a mandar, Loggueruser,(apartir de ahi currentuser) mira dsi hay un usuario y si hay que ponga toda la informacion, libros, etc
          } else {
            next()
          }
        })
        .catch(err => next(err));
    } else {
      next()
    }
  }
  
  