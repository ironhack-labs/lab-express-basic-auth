const isLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
        return res.render('auth/login', { errorMessage: 'Desautotizado' })
    }
    next()
}

module.exports = {isLoggedIn}