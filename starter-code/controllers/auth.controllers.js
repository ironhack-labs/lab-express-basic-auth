module.exports.signup = (req, res, next) => {
    res.render('auth/signup');
}

module.exports.login = (req, res, next) => {
    //console.log(req.session.currentUser);
    res.render('auth/login');
}
