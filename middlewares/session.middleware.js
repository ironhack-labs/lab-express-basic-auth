const User = require('../models/User.model')

module.exports.registeredUser = ((req, res, next) => {
    if (req.session.currentId) {
        User.findById(req.session.currentId)
                .then((u) => {
                    req.currentUser = u
                    res.locals.currentUser = u

                    next()
                })
                .catch(e => next(e))
    } else {
        next()
    }
})