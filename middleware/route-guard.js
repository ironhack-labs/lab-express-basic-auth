const IsLoggedOut = (req, res, next) => {
    console.log('_*_*_*_*_Checking Session_*_*_*_*_ : ', req.session)
    !req.session.currentUser ? res.render('auth/login-view', { errorMessage: 'Desautorizado' }) : next()

}

const IsLoggedIn = (req, res, next) => {
    req.session.currentUser ? res.redirect('/mi-perfil') : next()
}

module.exports = {IsLoggedOut,IsLoggedIn}