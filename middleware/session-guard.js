const isLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
        return res.render('user/my-profile', { errorMessage: 'Desautotizado' })
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