const createError = require('http-errors');
const { default: mongoose } = require('mongoose');
const User = require('../models/User.model');

module.exports.signup = (req, res, next) => {
  res.render('auth/signup');
}

module.exports.doSignup = (req, res, next) => {
  const renderWithErrors = (errors) => {
    res.render('auth/signup', {
      user: {
        email: req.body.email,
        name: req.body.name
      },
      errors
    })
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        // lo intento crear
        return User.create(req.body)
          .then(user => {
            res.redirect('/')
          })
      } else {
        renderWithErrors({ email: 'Email already in use' })
      }
    }) // o un usuario || null
    .catch(err => {//si hago console de error , eso da un campo error, un array, y pone validation error,
      //da una instacia de error. 
      if (err instanceof mongoose.Error.ValidationError) {//si es un error de validation pinta eso, y sino da lo siguiente
        renderWithErrors(err.errors)
      } else {//en el caso de que haya petado la base de datos, sale este apartado de error
        next(err)
        //si se soluciona uno, pasará al otro error en la app.js
      }
    })
}

module.exports.login = (req, res, next) => {
  res.render('auth/login')
}
/*




*/

module.exports.doLogin = (req, res, next) => {
  const { email, password } = req.body;

  const renderWithErrors = () => {
    res.render(
      'auth/login',
      {
            /*
            el email viene del req.body
              renderiza en el campor user el email
              da un error sin especificar 
            */
        user: { email },
        errors: { email: 'Email or password are incorrect' }
      }
    )
  }
//si no hay email y contraseña da el error
  if (!email || !password) {
    renderWithErrors()
  }

  // Comprobar si hay un usuario con este email
  User.findOne({ email }) // dklashdlkjashDFJKSAHFIJSDAHKL - 12345678
    .then(user => {
      if (!user) {
        renderWithErrors()//llamo a la funcion ya hecha con el error , mas arriba
      } else {
        return user.checkPassword(password)//check password es un metodo relacionado al modelo, ahi lo compara si son iguales las contraseñas
        //ahi el checkpasword devuelve una promesa..puesta aqui
          .then(match => {
            if (!match) {
              renderWithErrors()//la contaseña está mal y da error
            } else {
              req.session.userId = user.id//si todo va bien, lo guardo en una sesion  de express. Expression sesion hace que todo funcione..en session.confi
              res.redirect('/profile')//se guarda en mongo..app.js
            }
          })
        // Comprobamos que la contraseña sea correcta
      }
    })
    .catch(err => {
      next(err)
    })
}

module.exports.logout = (req, res, next) => {
  req.session.destroy()
  res.redirect('/login')
}