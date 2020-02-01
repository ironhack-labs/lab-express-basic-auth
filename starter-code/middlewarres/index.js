exports.isLoggedIn = (req, res, next) => {
  req.session.loggedUser ? next() : res.redirect('/login')
}