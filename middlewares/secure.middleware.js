module.exports.isAuthenticated = (req, res, next) => {
  if (req.session.currentUserId) {
    next()
  } else {
    res.redirect('/login')
  }
}

module.exports.isNotAuthenticated = (req, res, next) => {
  if (req.session.currentUserId) {
    res.redirect('/profile')
  } else {
    next()
  }
}