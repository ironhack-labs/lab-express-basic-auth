const isMain = (req, res, next) => {
  if (req.session.currentUser.isMain) {
    return next();
  }
  res.redirect("/profile");
};

module.exports = isMain;
