function isLoggedIn(req, res, next) {
    if (req.session.currentUser) {
        next()
    } else {
        res.render('auth/login', { errorMessage: 'Inicia sesión para acceder' })
    }
}

function isLoggedOut(req, res, next) {
    //console.log("im here", req.session.currentUser)
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