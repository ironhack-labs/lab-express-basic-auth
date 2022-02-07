const isLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
        res.redirect('/')
        return
    }
    next()
}

module.exports = {isLoggedIn}