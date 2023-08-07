const isLoggedIn = (req, res, next) => {
    if (req.session.currentUser) {
        next()
    } else {
        res.redirect('/inicio-sesion')
    }
}


module.exports = {
    isLoggedIn,
}