module.exports = {
  checkLoggedIn: (redirectPath) =>{
    return (req, res, next) => {
      if (req.session.currentUser) {
        next();
      } else {
        res.redirect(redirectPath);
      }
    }
  },
  checkLogged: (req, res, next) => {
    if (req.session.currentUser) {
      next();
    } else {
      res.redirect('/users');
    }
  }
}
