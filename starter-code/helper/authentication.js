

module.exports = {
  authentication: (errorPath) => {
    return (req, res, next) => {
      if(req.session.currentUser) next();
      else{
        res.redirect(errorPath);
        return;
      }
    };
  }
};
