function isLoggedOut(req, res, next) {
  if (req.session.userId) {
    return res.redirect(`/user${req.session.userId}`);
  }

  next();
}

module.exports = isLoggedOut;
