const isLoggedIn = (req, res, next) => { 
  if (!req.session.currentUser) {
    return res.redirect('/login')
  }
  next()
}

const isLoggedOut = (req, res, next) => { 
  if (req.session.currentUser) {
    req.app.locals.isLoggedIn = false
    return res.redirect('/')
  }
  next()
}

const logStatus = (req, res, next) => { 
  if (req.session.currentUser) req.app.locals.isLoggedIn = true
  else req.app.locals.isLoggedIn = false

  next()
}

module.exports = {isLoggedIn, isLoggedOut , logStatus}