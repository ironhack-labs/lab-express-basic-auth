const isLoggedIn = (req, res, next) => {
    if (req.session.currentUser) {
        next()
    } else {
        res.render('auth/signin-form', { errorMessage: 'Sign in to continue' })
    }
}

const isLoggedOut = (req, res, next) => {
    if (!req.session.currentUser) {
        next()
    } else {
        res.redirect('/profile')
    }
}

module.exports = { isLoggedIn, isLoggedOut }