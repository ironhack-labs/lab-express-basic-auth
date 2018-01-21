module.exports.profile = (req, res, next) => {
    res.render('user/profile', {user: req.session.currentUser})
}

module.exports.main = (req, res, next) => {
    res.render('user/main', {user: req.session.currentUser})
}

module.exports.private = (req, res, next) => {
    res.render('user/private', {user: req.session.currentUser})
}