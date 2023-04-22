const isLoggedOut = (req, res, next) => {
    if (!req.session.user) {
        let userLogged = false       
        next();
        return;
    }

    res.redirect("/profile");
};

module.exports = isLoggedOut;