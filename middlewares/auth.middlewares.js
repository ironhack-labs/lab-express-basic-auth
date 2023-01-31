module.exports.isAuthenticated = (req, res, next) => {
  if (req.session?.userId) {
    next() // esta autenticado? pasa al siguiente middleware, pasa al profile (verlo en la ruta) - estoy protegiendo la vista del perfil al unico usuario que este autenticado
  } else {
    res.redirect('/login')// si no esta autenticado paso al login
  }
}

module.exports.isNotAuthenticated = (req, res, next) => {
  if (!req.session?.userId) {
    next()
  } else {
    res.redirect('/profile')
  }
}