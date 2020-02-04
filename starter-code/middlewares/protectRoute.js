module.exports = function protectRoute(req, res, next) {
    if (req.session.currentUser) next();
    else {
      req.flash("error", "Access denied - you are not logged in");
      res.redirect("/login")
    }
}
