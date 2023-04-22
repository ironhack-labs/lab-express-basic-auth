const isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        let userLogged = true
        next();
        return;
    }

    res.redirect("/login");
};


module.exports = isLoggedIn;



