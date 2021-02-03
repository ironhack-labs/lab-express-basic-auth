const mongoose = require("mongoose")
const User = require("../models/User.model")

module.exports.register = (req, res, next) => {
    res.render('register')
}

module.exports.doRegister = (req, res, next) => {
    function renderWithErrors(errors) {
    res.status(400).render('register', {
      errors: errors,
      user: req.body
    })
    }

    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                renderWithErrors({
                    email: "Email already exists"
                })
            }
            else {
                User.create(req.body)
                    .then(() => {
                        //console.log(user)
                        res.redirect("/")
                    })
                    .catch((e) => {
                        if (e instanceof mongoose.Error.ValidationError) {
                            renderWithErrors(e.errors)
                        } else {
                            next(e)
                        }
                    })
            }
        })
        .catch((e)=> next(e))
}