const loggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
        res.redirect('/inicio-sesion')
        return
    }
    next();
}
module.exports = {
    loggedIn
}

