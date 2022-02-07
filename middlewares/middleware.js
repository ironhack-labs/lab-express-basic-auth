const isLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
        res.redirect('/auth/log-in')
        return
    }
    next();
}

module.exports = {
    isLoggedIn
}