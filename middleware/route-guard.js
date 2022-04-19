const isLoggedIn = (req, res, next) => {
    !req.session.currentUser ? res.render('auth/login', { errorMessage: 'No autorizado, Registrate' }) : next()
}

const isLoggedOut = (req, res, next) => {
    req.session.currentUser ? res.redirect('/mi-perfil') : next()

}
module.exports = { isLoggedIn, isLoggedOut }