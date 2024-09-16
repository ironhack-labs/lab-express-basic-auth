module.exports.profile = (req, res, next) => {
    res.render('user/profile');
  }

  module.exports.main = (req, res, next) => {
    res.render('user/main');
  }

  module.exports.private = (req, res, next) => {
    res.render('user/private');
  }