
const isLoggedIn = (req, res, next) => {
    !req.session.currentUser ? res.render('auth/login', { errorMessage: 'Desautorizado' }) : next()
}

const isLoggedOut = (req, res, next) => {
    req.session.currentUser ? res.redirect('/perfil') : next()
}


module.exports = { isLoggedIn, isLoggedOut }