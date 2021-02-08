module.exports.home = (req, res, next) => res.render('index');

module.exports.termsAndConditions = (req, res, next) => res.render('terms-and-conditions');

module.exports.main = (req, res, next) => res.render('protected/main');

module.exports.private = (req, res, next) => res.render('protected/private');