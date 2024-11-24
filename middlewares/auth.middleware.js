module.exports.isAutenticated = (req, res, next) => {
    if (req.currentUser) {
        next();
    }else{
        res.redirect("/login");
    }


};

module.exports.isNoAutenticated = (req, res, next) => {
    if (!req.currentUser) {
        next();
    }else{
        res.redirect("/main");
    }
};