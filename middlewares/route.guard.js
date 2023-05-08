const isLoggedIn = (req, res, next) => {
    req.session.currentUser ? next() : res.redirect("/login")
}

const isLoggedOut = (req, res, next) => {
    !req.session.currentUser ? next() : res.redirect("/profile")
}

module.exports = { isLoggedIn, isLoggedOut }