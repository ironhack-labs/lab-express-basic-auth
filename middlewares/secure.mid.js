
module.exports.isAuthenticated = (req, res, next) => {
    const user = req.session.user;
    if (user) {
      next();
    } else {
      res.redirect('/login');  //aqui tiene que mandar a private
    }
  }