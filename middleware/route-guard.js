const isLoggedIn = (req, res, next) => {
    if(!req.session.user) res.redirect('/forbidden');
    next();
};

module.exports = isLoggedIn;