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
                res.redirect("/")
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
