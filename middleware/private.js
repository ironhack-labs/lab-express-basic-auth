function private(req, res, next) {
  if (!req.session.currentUser) {
    res.redirect("/");
    return;
  }
  next();
}

module.exports = private;
