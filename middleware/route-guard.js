function isLoggedIn(req, res, next) {
    if (req.session.currentUser) {
        next()
    } else {
        res.render('auth/login', { errorMessage: 'Log in for access' })
    }
}

function isLoggedOut(req, res, next) {
    if (!req.session.currentUser) {
        next()
    } else {
        res.redirect('/private')
    }
}

module.exports = {
    isLoggedIn,
    isLoggedOut
}