const User = require('../models/User.model')


module.exports.registerView = (req, res, next) => {
    res.render('user/register')
}
module.exports.register = (req, res, next) => {

}