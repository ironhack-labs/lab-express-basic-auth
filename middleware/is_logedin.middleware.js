const isLogedin = (req, res, next) => {
    const user = req.session.user;
    if (user) {
        next();
        return 
    }
    res.redirect('/auth/login');
};

module.exports = isLogedin;
