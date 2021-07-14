module.exports.isAuthenticated = (req, res, next) => {
    console.log('authenticated')
    if (req.session.currentUser) {
      next();
    } else {
      res.redirect('/login');
    }
  }
  
  module.exports.isNotAuthenticated = (req, res, next) => {
    console.log('not authenticated')
    if (req.session.currentUser) {
      res.redirect('/profile');
    } else {
      next();
    }
  }