const isLoggedIn = (req, res, next) => {
    !req.session.currentUser ? res.render('/login', { errorMessage: 'Desautorizado' }) : next()
}

const isLoggedOut = (req, res, next) => {
    req.session.currentUser ? res.redirect('/user') : next()
}

module.exports = { isLoggedIn, isLoggedOut }