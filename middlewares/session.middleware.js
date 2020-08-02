const User = require('../models/User.model')

module.exports.auth = (req, res, next) => {
  User.findById(req.session.userId)
        .then(user => {
            if (user) {
                req.currentUser = user
                res.locals.currentUser = user

                next()
            } else {
                res.redirect('/login')
            }
        })
        .catch(next);
}