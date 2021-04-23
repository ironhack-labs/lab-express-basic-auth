const isUserLoggedIn = (req, res, next) => {
  req.session.user ? next() : res.redirect('/login')
}

module.exports = isUserLoggedIn;