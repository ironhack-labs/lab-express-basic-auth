// declaramos isLoggedIn
const isLoggedIn = (req, res, next) => {
    // si no hay usuario loggeado redirigimos al login
    if (!req.session.currentUser) {
        res.redirect('/login')
        return
    }
    next()
}

// exportamos
module.exports = { isLoggedIn }