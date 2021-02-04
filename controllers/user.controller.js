const User = require('../models/User.model')
const mongoose = require('mongoose') // vamos a utilizar funcionalidades de mongoose para detectar que el error es de validación


module.exports.registerView = (req, res, next) => {
    res.render('user/register')
}

module.exports.register = (req, res, next) => {
    function renderErrors(errors) {
        res.status(400).render('user/register', { 
            errors: errors,
            user: req.body                                                     // Para que no se borre el contenido ya escrito si hay error -> en la vista en value user:email
        })
    }

    User.findOne({ email: req.body.email })                                    // Query para validar si ya existe en mi BD
        .then((u) => {                                                         // podría tener mi usuario si ya existe o devolver undefined
            if (u) {                                                           // si existe, no podemos dejar que se crea
                renderErrors({ email: 'This email is already signed in' })
            } else {                                                           // no lo encuentra, procedemos
                User
                    .create(req.body)
                    .then((u) => {
                        console.log(u)
                        res.redirect('/register')
                    })
                    .catch((e) => {
                                                                                // levaría al middelware de errores de www. No hacerlo:
                                                                                // ¿el e que me llega es una instancia de mongoose.error.validation error?
                        if (e instanceof mongoose.Error.ValidationError) {
                            renderErrors(e.errors)                              //volver a mandar a la vista con la info pero con errores
                        } else {
                            next(e)                                             // si no es de valid, enviar al middelware de errores
                        }
                    })
            }
        })
        .catch((e) => next(e))

}