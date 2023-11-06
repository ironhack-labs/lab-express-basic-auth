const isLoggedIn = (req, res, next) => {
    if (req.session.curentUser) {
        next()
    } else {
        res.redirect('/login')
    }
}

module.exports = isLoggedIn