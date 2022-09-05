const isLoggedIn = (req, res, next) => {
    const user = req.session.user;
    user ? next() : res.render('auth/login', { message: 'No autorizado compadre' })
};

module.exports = isLoggedIn;