const isLoggedIn = (req, res, next) => {
    req.session.currentUser ? next() : res.redirect('/inicio-sesion')
}

const isLoggedOut = (req, res, next) => {
    !req.session.currentUser ? next() : res.redirect('/perfil')
}

module.exports = { isLoggedIn, isLoggedOut }