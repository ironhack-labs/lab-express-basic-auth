module.exports.isAuthenticated = (req, res, next) => {
    const user = req.session.user;
    if (user) {
        console.log("user");
        next();
    } else {
        console.log("else");
        res.redirect("/login");
    }
}