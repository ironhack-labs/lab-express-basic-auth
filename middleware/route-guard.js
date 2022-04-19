const req = require("express/lib/request")

const isLoggedIn = (req, res, next) => {
    console.log('sirveeesss? shi shirves', req.session)
    !req.session.currentUser ? res.render('auth/login', { errorMessage: 'Desautorizado' }) : next()
}

const isLoggedOut = (req, res, next) => {
    req.session.currentUser ? res.redirect('/mi-perfil') : next()

}

module.exports = { isLoggedIn, isLoggedOut }
