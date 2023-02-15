const isLoggedOut = (req, res, next) => {
    if (!req.session.user) res.redirect("/nope");
    next();
}

module.exports = isLoggedOut;