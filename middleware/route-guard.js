const isLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
        res.redirect('/iniciar-sesion')
        return
    }
    next();
}

module.exports = {
    isLoggedIn
}