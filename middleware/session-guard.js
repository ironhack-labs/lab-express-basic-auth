const isLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
        return res.render('auth/login', {errorMessage: 'Not authorized'})
    }
    next()
}

module.exports = {isLoggedIn}