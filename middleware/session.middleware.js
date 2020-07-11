const User = require('../models/User.model')

module.exports.authentication = (req, res, next) => {
    const userId = req.session.userId;

    if(userId) {
        User.findById
    }
}