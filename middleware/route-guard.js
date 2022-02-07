const isLoggedIn = (req, res, next) => {

    // si no hay usuario loggeado redirigimos al login
    if (!req.session.currentUser) {
        res.redirect('/signup')
        return
    }
    next();
}

module.exports = {
    isLoggedIn
}