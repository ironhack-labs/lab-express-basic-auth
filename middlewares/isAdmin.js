const isAdmin = (req, res, next) => {
  if (req.session.user.admin) {
    next();
    return;
  }

  res.redirect("/profile");
};

module.exports = isAdmin;
