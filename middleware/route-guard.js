const isLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
        res.redirect('/auth/login');
        return
    }
    next();
};


const isLoggedOut = (req, res, next) => {
    if (req.session.currentUser) {
        res.redirect('/');
        return
    }
    next();
};

module.exports = {
    isLoggedIn,
    isLoggedOut
};