module.exports = function(app, passport) {
  app.get('/', (req, res) => {
    res.render('authViews/login', {message: req.flash('loginMessage')[0]})
  })

  app.post('/', passport.authenticate('local-login', {
    successRedirect: '/homepage',
    failureRedirect: '/',
    failureFlash: true
  }))
  
  app.get('/signup', (req, res) => {
    res.render('authViews/signup', {
      wrongEmailAndUsername: req.flash('wrongEmailAndUsername')[0],
      wrongEmail: req.flash('wrongEmail')[0],
      wrongUsername: req.flash('wrongUsername')[0]
    })
  })
  
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/homepage',
    failureRedirect: '/signup',
    failureFlash: true
  }))

  app.get('/homepage', isLoggedIn, (req, res) => {
    res.render('authViews/app')
  })

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/')
    }
}
}
