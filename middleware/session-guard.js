const isLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
        return res.render('user/myprofile', { errorMessage: 'Desautorizado' })
    }
    next()
}

const isLoggedOut = (req, res, next) => {
    if (req.session.currentUser) {
        return res.redirect('/')
    }
    next()
}

module.exports = { isLoggedIn, isLoggedOut }