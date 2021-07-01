module.exports.isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
        next()
    } else {
        res.redirect("/login")
    }
}

module.exports.isNotAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
        res.redirect("/profile")
    } else {
        next()
    }
}