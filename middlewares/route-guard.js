const isLoggedIn = (req, res, next) => {
    req.session.currentUser
        ? next()
        : res.render('auth/login-form', { noSession: 'Please login to continue' })
}
const isLoggedOut = (req, res, next) => {
    !req.session.currentUser
        ? next()
        : res.redirect('/my-account')
}

module.exports = { isLoggedIn, isLoggedOut }