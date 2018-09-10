module.exports = function (req, res, next) {

    if (req.session.currentUser) {
        next();
    } else {
        return res.render("auth/login", {
            errorMessage: "You have to log in to get access to protected content!"
        });
    }
};

