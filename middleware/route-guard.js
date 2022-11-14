function isLoggedIn(req, res, next) {
    if (req.session.currentUser) {
        next()
    } else {
        res.render('auth/login', { errorMessage: 'Inicia la sesión, melón' })
    }
}

function isLoggedOut(req, res, next) {
    if (!req.session.currentUser) {
        next()
    } else {
        res.redirect('/mi-perfil')
    }
}

module.exports = {
    isLoggedIn,
    isLoggedOut
}