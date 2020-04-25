module.exports = function (req, res, next) {
    if (req.session.currentUser) {
      next();
    } else {
      res.redirect("/signin");
    }
  };