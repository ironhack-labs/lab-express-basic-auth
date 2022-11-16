function isLoggedIn(req, res, next) {
    // Check if user is logged in
    if (!req.session.user) {
        return res.redirect("/auth/login")
    }
    else{
    next()
    }
}

module.exports = {
    isLoggedIn
}
