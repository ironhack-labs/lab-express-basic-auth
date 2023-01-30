const createError = require ("http-errors");
const {default : mongoose } = require ("mongoose");
const User = require ("../models/User.model");

module.exports.signup = ( req, res, next) => {
    res.render("auth/signup");
}

module.exports.doSignup = (req, res , next) => {
    const renderWithErrors = (errors) => {
        res.render("auth/signup", {
            user: {
                email: req.body.email,
                name: req.body.name
            },
            errors  // DEJO A USER SEPARADO DE ERROR PORQUE SI LE PASO EL REQ.BODY LE PASO TAMBIEN LA CONTRASEÑA. (Indico solo lo que quiero)
        })
    }
    User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        // lo intento crear- la promesa con un return comparte el catch
        return User.create(req.body)
          .then(user => {
            res.redirect('/')
          })
      } else {
        renderWithErrors({ email: 'Email already in use' })
      }
    }) // o un usuario || null
    .catch(err => {
      if (err instanceof mongoose.Error.ValidationError) { // verificamos que el error es una instacia de validacion de mongoose
        renderWithErrors(err.errors)
      } else {
        next(err)
      }
    })
// este catch es para saber si mongoose ha fallado al crear el modelo.
};

module.exports.login = (req, res, next) => {
  res.render ("auth/login")
};

module.exports.doLogin = (req, res, next) => {
  const {email, password} = req.body ; 

  const renderWithErrors = () => {
    res.render ("auth/login", { 
      user : { email},
      errors : { email : "email or password are incorrect"}
    })
  }
  if ( !email || !password) {
    renderWithErrors
  }

  // comprobar si existe un usuario con el email en la BBDD
User.finOne ( { email }) //contraseña hasheada => rawPassword 
 .then(user => {
  if (!user) {
    renderWithErrors()
  } else {
    return user.checkPassword(password)
    .then (match => {
      if (!match) {
        renderWithErrors() // la password esta mal 
      } else {
        req.session.userId = user.userId // la contraseña ha estado bien y coincide con el hasheo
        res.redirect ("/profile")
      }
    })

    // comprobamos que la contraseña sea correcta
  }
 })
 .catch(err => {
  next(err)
 })
}

 module.exports.logout = (req, res, next) => {
  req.session.destroy()
  res.redirect("/login")
 }


