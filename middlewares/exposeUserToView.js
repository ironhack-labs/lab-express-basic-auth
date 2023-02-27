function exposeUsers(req, res, next) {
    console.log(req.session.currentUser)
    if (req.sessions.currentUser) {
        res.locals.currentUser = req.session.currentUser;
        res.locals.isLoggedIn = true
    }
    next()
}

module.exports = exposeUsers
