const loginCheck = () => (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/main');
  }
};

module.exports = {
  loginCheck,
};
