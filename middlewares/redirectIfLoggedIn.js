const redirectIfLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/main');
    return;
  }

  next();
};

module.exports = redirectIfLoggedIn;
