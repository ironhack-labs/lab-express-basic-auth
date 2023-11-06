const isLoggedIn = (req, res, next) => {
    if (req.session.currentUser) {
        next()
    } else {
        res.redirect('/log-in')
    }
}

module.exports = isLoggedIn