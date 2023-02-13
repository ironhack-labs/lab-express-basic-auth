const isLoggedIn = (req, res, next) => {
    if (req.session.currentUser) {
        next()
    }
    else {
        res.render('sign-form', { errorMessage: 'Sign up to continue!!!' })
    }
}

const isLoggedOut = (req, res, next) => {
    if (!req.session.currentUser) {
        next()
    }
    else {
        res.redirect('/')
    }
}

module.exports = { isLoggedIn, isLoggedOut }