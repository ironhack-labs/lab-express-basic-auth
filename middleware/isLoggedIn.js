module.exports = (req, res, next) => {
    if (!req.session.currentUser) {
        return res.redirect("/auth/login");
    }
    req.user = req.session.user;
    next();
    };