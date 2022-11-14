function isLoggedin(req, res, next) {
    if (req.session.currentUser) {
        next()
    } else {
        res.render('auth/login', { errorMessage: 'Inicia sesion' })
    }
}
function isLoggedout(req, res, next) {
    if (!req.session.currentUser) {
        next()
    } else {
        res.redirect('/mi-perfil')
    }
}
module.exports = {
    isLoggedin, isLoggedout
}