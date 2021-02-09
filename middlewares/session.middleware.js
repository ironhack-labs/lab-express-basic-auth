const User = require("../models/User.model")

module.exports.findUSer = (req, res, next) => {
    if (req.session.currentUserId) {
        User.findById(req.session.currentUserId)
            .then((user) => {
                if (user) {
                    req.currentUser = user
                    res.locals.currentUser = user

                    next()
                }
            })
            .catch(e => next(e))
    } else {
        next()
    }
}

