module.exports.isAuthenticated = (req, res, next) => {
  if (req.session.currentUserId) {
    next()
  } else {
    res.render('errors/forbiddenCat')
  }
}

module.exports.isAdmin = (req, res, next) => {
  if (req.session.currentUserId) {
    next()
  } else {
    res.render('errors/forbiddenAdmin')
  }
}
