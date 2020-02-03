exports.isLoggedIn = (req, res, next) => {
  req.session.loggedUser ? next() : res.redirect('/auth/login')
  /*
  if(req.session.loggedUser) {
    next()
  } else {
    res.redirect('/auth/login')
  }
  */
}