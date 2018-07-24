const requireUser = (req,res,next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
};

const requireAnom = (req, res, next) => {
  if (!req.session.currentUser) {
    next();
  } else {
    res.redirect('/');
  }
}

module.exports = {
  requireUser,
  requireAnom
}