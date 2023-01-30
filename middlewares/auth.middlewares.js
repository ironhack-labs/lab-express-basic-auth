module.exports.isAuthenticated = (req, res, next) => {
  if (req.session?.userId) {
    next()
  } else {
    res.redirect('/login')
  }
}

module.exports.isNotAuthenticated = (req, res, next) => {
  if (!req.session?.userId) {
    next()
  } else {
    res.redirect('/profile')
  }
}