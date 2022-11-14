
function isLoggedIn(req, res, next) {
  if (req.session.currentUser) {
    next()
  } else {
    res.render('auth/login', { errorMessage: 'Init the session' })
  }
}

function isLoggedOut(req, res, next) {
  if (!req.session.currentUser) {
    next()
  } else {
    res.redirect('/my-profile')
  }
}


module.exports = {
  isLoggedIn,
  isLoggedOut
}