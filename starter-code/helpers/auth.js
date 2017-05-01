module.exports = {
  checkLoggedIn: (redirectPath) =>{
    return (req, res, next) => {
      if (req.session.currentUser) {
        next();
      } else {
        res.redirect(redirectPath);
      }
    }
  }
}
