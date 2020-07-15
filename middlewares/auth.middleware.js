const User = require('../models/user.model');

module.exports.isAuthenticated = (req, res, next) => {
    req.session.userId
    if (req.session.userId) {
        User.findById(req.session.userId)
            .then(user => {
                if (user) {
                    req.currentUser = user;
                    res.locals.currentUser = user;
                    next()
                } else {
                    res.redirect('login');
                }
            })
    } else {
        res.redirect('login');
    }; 
}
