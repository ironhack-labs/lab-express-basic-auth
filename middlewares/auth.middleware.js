module.exports.isAuthenticated = (req, res, next) => {
  // para saber si esta autenticado/pasa al siguiente middleware..en routes.config.js
  if (req.currentUser) {
    next()
  } else {
    res.redirect('/login')
  }
}

module.exports.isNotAuthenticated = (req, res, next) => {
  // para saber si esta autenticado
  if (!req.currentUser) {
    next()
  } else {
    res.redirect('/profile')
  }
}