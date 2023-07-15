// Creamos un middleware que verifique si el usuario está autenticado. En el caso de que esté autenticado, es decir, que haya currentUser, le decimos que pase a la siguiente parte.
// En caso de que no haya current user, le redigirimos a la página de login para que se pueda autenticar.
module.exports.isAuthenticated = (req, res, next) => {
    if (req.currentUser) {
        next()
    } else {
        res.redirect('/login')
    }
};

// Creamos un middleware que verifique si no está autenticado. En el caso de que esté autenticado, es decir, que haya currentUser, le redirigimos a la página de perfil de usuario.
// En el caso de que no esté autenticado le indicamos que pase a la siguiente parte.

module.exports.isNotAuthenticated = (req, res, next) => {
    if (req.currentUser) {
        res.redirect('/user/profile')
    } else {
        next();
    }
}