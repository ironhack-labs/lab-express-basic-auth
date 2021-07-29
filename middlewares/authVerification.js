function authVerification(req, res, next) {
    if (req.session.currentUser) return next()

    res.redirect("/signin");

}
  
  module.exports = authVerification;    