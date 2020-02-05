module.exports = function privateRoute(req, res, next) {
    if (req.session.currentUser) next()
    else res.redirect("/admin/login");
}