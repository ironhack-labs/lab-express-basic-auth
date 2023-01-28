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
            errors
        })
    }
}