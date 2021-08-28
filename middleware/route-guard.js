const isLoggedIn = (req, res, next) => {
  if (!req.session?.user) {
    return res.redirect('/auth/login');
  }

  next();
};

const isLoggedOut = (req, res, next) => {
  if (req.session?.user) {
    res.redirect('/user/profile');
  } else {
    next();
  }
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
};
