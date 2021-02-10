//const User = require('../models/User.model')

module.exports.findUser = (req, res, next) => {
    if (req.session.currentUserId) {
        User.findById(req.session.currentUserId)
            .then((user) => {
                if (user) {
                    req.currentUser = user
                    res.locals.currentUser = user
                    next()
                }

            })
    } else {
        next()
    }
}

/*module.exports.isAuthenticated = (req, res, next) => {
    if (req.session.currentUserId) {
        next()
    } else {
        res.redirect('/login')
    }
}

module.exports.isNotAuthenticated = (req, res, next) => {
    if (req.session.currentUserId) {
        res.redirect('/profile')
    } else {
        next()
    }
}*/