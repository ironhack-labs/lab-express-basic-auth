

module.exports.public = (req, res, next) => {
    res.render('user/main');
}

module.exports.profile = (req, res, next) => {
    res.render('user/private', { user: req.session.currentUser });
}