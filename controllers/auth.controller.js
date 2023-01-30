const { model } = require("mongoose");
const User = require("../models/User.model")

module.exports.signup = (req, res, next) => {
    res.render("auth/signup")
}

module.exports.doSignup = (req, res,  next) => {
    const { username, password } = req.body;

    User.findOne({ username })
    .then(user => {
        if(!user) {
            User.create({ username, password })
            .then(created => {
                res.redirect("/login")
            })
            .catch(err => {
                const errors = err.errors;
            
                res.render("auth/signup", {
                    user: {
                        username: username
                    },
                    errors: {
                        password: errors.password.properties.message
                    }
                })
            })
        } else {
            res.render("auth/signup", {
                user: {
                    username: username
                },
                errors: {
                    username: 'This username already exists.'
                }
            })
        }
    })
    .catch(err => console.log(err))
}

module.exports.login = (req, res, next) => {
    res.render("auth/login")
}

module.exports.doLogin = (req, res, next) => {
    const { username, password } = req.body;

    const renderWithErrors = () => {
        res.render('auth/login', {
            user: {username},
            errors: { username: 'Username or password are incorrect'}
        })
    }

    if(!username || !password) {
        renderWithErrors()
    }

    //comprobar si hay un user con este username
    User.findOne({ username })
        .then(user => {
            if (!user) {
                renderWithErrors()
            } else {
                req.session.currentUser = user
                res.redirect('/profile')
            } 
        })
        //comprueba que la contraseña sea correcta
        .catch(err => {
            next(err)
        })
}


module.exports.logout = (req, res, next) => {
    req.session.destroy();
    res.redirect("/login");
};

module.exports.profile = (req, res, next) => {
    const user = req.session.currentUser;
    res.render('user/profile', { user })
}