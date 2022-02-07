const isLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
        res.redirect('/ingresar')
        return
    }
    next()
}

module.exports = { isLoggedIn }