const usuarioLoggeado = (req, res, next) => {
      // aqui se verifica si el usuario no está loggeado, si no lo esta habrá que enviarlo a login
      if (!req.session.currentUser) {
            res.redirect('/auth/login');
            return;
      }
      next();
}

// Esta es el área de autenticación, es decir, el usuario ya se autenticó y quiere entrar a otras áreas como signup y login por lo que lo redirigimos al home.
const usuarioNoLoggeado = (req, res, next) => {
    if (req.session.currentUser) {
        return res.redirect('/');
    }

    // si no está autenticado entonces lo mandamos al signup o login
    next();
}

module.exports = {
      usuarioLoggeado,
      usuarioNoLoggeado
}