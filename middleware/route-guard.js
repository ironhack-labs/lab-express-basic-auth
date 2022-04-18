// ----- Check if its Loged IN

const isLoggedIn = (req, res, next) => {
    !req.session.currentUser ? res.render('auth/login', { errorMessage: 'Desautorizado' }): next()
}

module.exports = isLoggedIn