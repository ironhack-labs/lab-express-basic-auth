
module.exports.isAuthenticated = (req, res, next) => {
    if (req.user) {
        next();
    } else if(!req.user) {
        res.redirect('/private');
    } else {
        next();
    }
}