const isLoggedIn = (redirectURL) => {
  return (req,res,next) => {
      if (req.session.currentUser) {
        next();
      } else {
        console.log("No puedes Pasar!!");
        res.redirect(redirectURL);
      }
  };
};

module.exports = isLoggedIn;