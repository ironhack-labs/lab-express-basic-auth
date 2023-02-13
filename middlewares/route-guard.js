const isLoggedin = (req, res, next) => {
    if (req.session.currentUser) {
        next()
    }
    else {
        res.render('auth/login-form', { errorMessage: 'Log in to continue' })
    }
}

const isLoggedOut = (req, res, next) => {
    if (!req.session.currentUser) {
        next()
    }
    else {
        res.redirect('/private')
    }


}

module.exports = { isLoggedin, isLoggedOut }