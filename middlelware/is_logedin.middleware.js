const isLogedin = (req, res, next) => {
    const user = req.session.user;
    if (user) {
        req.app.locals.name = user.username
        req.app.locals.disabled = false
        next();
        return;
    }
    req.app.locals.name = null
    res.redirect('/auth/login');

};



module.exports = isLogedin;

