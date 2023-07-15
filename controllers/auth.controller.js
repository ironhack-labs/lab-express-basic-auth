const { router } = require('../app')
const User = require('../models/User.model')
const mongoose = require('mongoose')

// SIGN UP
module.exports.signup = (req, res, next) => {
    res.render('auth/signup')
}

//DO SIGN UP
module.exports.doSignup = (req, res, next) => {

    // Creo una función renderWithErrors que renderice de nuevo la página del formulario y le paso el username y los errores para poder usarlos en el formulario y escribirle al usuario lo que había puesto y además indicarle el error).
    const renderWithErrors = (errors) => {
        res.render('auth/signup', {
            user: {
                username: req.body.username,
            },
            errors
        });
    };

    // Ahora voy a buscar en la DB un usuario con el mismo username que me ha llegado por el req.body de username.
    User.findOne({ username: req.body.username })
    .then(user => {
        if (!user) { // Si no encuentra usuario que coincida con ese nombre entonces creo ese usuario y lo redigirijo a la página de log in para que inicie sesión.
            return User.create(req.body)
            .then( user => {
                console.log(`User ${user.username} has been created`)
                res.redirect('login')
            })
        } else { // Si encuentra alguien con el mismo username en la DB le paso la función renderWithErrors y le indico que en username diga que ese usuario ya está en uso, para que luego a la hora de utilizarlo en el form me pinte esa frase.
            renderWithErrors({ username: 'Username already in use'})
        }
    })
    .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
            console.log(error.errors);
            renderWithErrors(error.errors)
        } else {
            next(error)
        }
    });
}

// LOG IN
module.exports.login = (req, res, next) => {
    res.render('auth/login')
}

// DO LOG IN
module.exports.doLogin = (req, res, next) => {
    const { email, password } = req.body; // Hago un destructuring del username y password que me han llegado en el req.body 

    // Creo una función que renderice la página del form de log in y le paso el username y los errores (para poder pasarle al form esos valores y que a la hora de volver a renderizar esa página si ha habido un error, nos pinte tanto lo que habíamos escrito como el error que ha ocurrido)
    const renderWithErrors = () => {
        res.render('auth/login', {
            user: {
                email
            }, 
            errors: { email: 'Email or password are incorrect'}
        })
    };
    
    // Si no hay username o password le paso la función renderWithErrors
    if (!email || !password) {
        renderWithErrors()
    };

    // Ahora le indico que me busque un usuario en la DB con el mismo email que me ha llegado por el req.body
    User.findOne({ email: email })
    .then(user => {
        if (!user) {
            console.log('no coincide') // Si no encuentra ningún usuario con ese email llamo a la función renderWithErrors.
            renderWithErrors()
        } else {
            console.log('entra en password') // Si encuentra un email que coincida en la DB tenemos que comprobar que la contraseña que llega por el req.body también coincida. Esto lo hacemos con la función checkPassword que la declaramos en el modelo de User.
            user.checkPassword(password)
            .then((match) => {
                if(!match) { // Si la contraseña no coincide con la que hay en la DB renderizamos renderWithErrors.
                    renderWithErrors();
                } else { // Si la contraseña coincide con la de la DB guardamos el id en req.session con la clave userId (lo vamos a utilizar luego) y redirigimos a user/profile
                    req.session.userId = user.id;  
                    res.redirect('/user/profile')
                }
            })
            .catch(() => renderWithErrors());
        }
    })
    .catch(error => {
        next(error)
    })
}

// DO LOG OUT

module.exports.logout = (req, res, next) => {
    req.session.destroy();  // Destruimos la sesión en la DB
    res.clearCookie('connect.sid');  // Destruimos la cookie de sesión (entre paréntesis hay que pasarle el nombre de la cookie, las cookies creadas con express siempre tienen el nombre de connect.sid)
    res.redirect('/login')
}