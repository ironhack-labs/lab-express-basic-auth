const userIsLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {

        res.render('auth/log-in', { errorMessage: "please log-in matherfaker" })
        return
    }
    next();
}

module.exports = {
    userIsLoggedIn
}