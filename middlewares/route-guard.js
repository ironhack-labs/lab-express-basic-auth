const isLoggedIn = (req, res, next) => {
    if (req.session.currentUser) {
        next()
    }
    else {
        res.render('auth/log-in', { errorMessage: 'Inicia sesión para continuar' })
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