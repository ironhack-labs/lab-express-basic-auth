module.exports = redirect => (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect(redirect);
  }
};
