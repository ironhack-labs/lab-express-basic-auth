// middleware function to validate credentials
const isLoggedIn = (req, res, next) => {
  if (req.session.currentUser){
    next();
  }else{
    res.redirect("auth/login");
  }
};

module.exports = isLoggedIn;
