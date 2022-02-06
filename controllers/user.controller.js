

module.exports.profile = (req, res, next) => {
    res.render('user/profile');   
}

module.exports.private = (req, res, next) => {
    res.render('user/private');
}
