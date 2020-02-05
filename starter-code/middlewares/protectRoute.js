module.exports = function protectRoute(req, res, next) {
    if (req.session.currentUser) next();
    else res.redirect("/auth/signin");
}