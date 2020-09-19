const protRoutes = (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/login?sessionExpired=true');
    return;
  }

  next();
};

module.exports = protRoutes;
