const isLogged = (req, res, next) => {
    const user = req.session.user;
    if (user) {
        next();
        return;
    }
    res.redirect('/auth/login');
};

/*const isNotLogged = (req, res, next) => {
    if (!req.session.user) {
    
    }
}*/

module.exports = isLogged;