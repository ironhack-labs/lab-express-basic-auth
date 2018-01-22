

module.exports.profile = (req, res, next) => {
    res.render('user/profile', { user: req.session.currentUser });
}
