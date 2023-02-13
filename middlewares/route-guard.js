const isLoggedIn = (req, res, next) => {
    if (req.session.currentUser) {

        next()
    }

    else {
        res.render('auth/login-form', { errorMessage: 'Inicia sesión para continuar' })
    }
}


const isLoggedOut = (req, res, next) => {
    if (!req.session.currentUser) {
        next()
    }
    else {
        res.redirect('/profile')
    }
}

module.exports = { isLoggedIn, isLoggedOut }