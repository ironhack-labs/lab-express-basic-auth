const isLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
        res.redirect('/inicio')
        return
    }
    next();
}

module.exports = {
    isLoggedIn
}