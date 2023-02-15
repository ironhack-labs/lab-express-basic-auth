function isAuthenticated(req, res, next) {
    if (req, res, next) {
        next()
    } else {
        res.redirect('/login')
    }
}

module.exports = isAuthenticated
