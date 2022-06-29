const isLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
        return res.render('auth/login', { errorMessage: 'You do not posses enough credentials' })
    }
    next()
}

module.exports = {isLoggedIn} 