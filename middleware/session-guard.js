const isLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
        return res.render('auth/login', { errorMessage: 'Desautorizaden!' })
    }
    next()
}
module.exports = { isLoggedIn }