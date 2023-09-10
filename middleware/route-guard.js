
function isLoggedIn(req, res, next) {
    if (!req.session.currentUser) {
      return res.redirect("/login");
    }
  
    next(); 
  }

  function isLoggedOut (req, res, next) {
if (req.session.currentUser) {
return res.redirect("/")
}
next();
  }
  
  module.exports = {isLoggedIn, isLoggedOut}
  