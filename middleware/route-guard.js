
const isLoggedIn = (req, res, next) => {
    console.log('---PROBAR SESIÓN---->', req.session)
    !req.session.currentUser ? res.render('auth/inicio-sesion', { errorMessage: 'Inicie Sesión' }) : next()
}

const isLoggedOut = (req, res, next) => {
    req.session.currentUser ? res.redirect('/profile') : next()
}


module.exports = { isLoggedIn, isLoggedOut }