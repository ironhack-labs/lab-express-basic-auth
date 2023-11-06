const isLoggedIn = (req, res, next) => {
    if (req.session.currentUser) {
        next()
    } else {
        res.redirect("/")
    }
}


module.exports = isLoggedIn