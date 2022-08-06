function isLoggedOut(req, res, next) {
  if (req.session.currentUser) {
    return res.redirect(`/`);
  }
  next();
}

module.exports = isLoggedOut;
