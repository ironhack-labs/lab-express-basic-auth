const mongoose = require ('mongoose')
const User = require ('../models/User.model')


module.exports.signup = (req, res) => {
    res.render('../views/auth/signup.hbs')
}