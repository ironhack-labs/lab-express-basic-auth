
function isLoggedIn(req, res, next) {
    if (req.session.currentUser) {
      return next();
    }
    return res.redirect("/login");
  }
  
  function isAnon(req, res, next) {
    if (!req.session.currentUser) {
      return next();
    }
    return res.redirect("/private");
  }
  
  module.exports = { isLoggedIn, isAnon };