const  isLoggedIn = (req, res, next)  => {
    if (!req.session.currentUser) {
        return res.redirect("/login");
    }
    next();
}

module.exports = isLoggedIn;