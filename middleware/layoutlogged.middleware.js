const layoutLogged = (req, res, next) => {
    console.log(req)
    req.app.locals.loggedIn = req.session.user ? true : false
    next()
};

module.exports = layoutLogged;
