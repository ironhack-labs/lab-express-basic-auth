const isLoggedIn = (req, res, next) => {
    req.session.currentUser ? next() : res.redirect('/inicio-sesion')
}


const isLoggedOut = (req, res, next) => {
    !req.session.currentUser ? next() : res.redirect('/catalogo')
}

module.exports = { isLoggedIn, isLoggedOut }