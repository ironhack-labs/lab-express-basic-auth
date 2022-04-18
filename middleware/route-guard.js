const isLoggedIn = (req, res, next) => {
    console.log("LOGUEADO", req.session);
    !req.session.currentUser ? res.render("auth/login", {
        errorMessage: "Sin Login"
    }) : next()
}

const isLoggedOut = (req, res, next) => {
    req.session.currentUser ? res.redirect('/') : next()
}

module.exports = { isLoggedIn, isLoggedOut }