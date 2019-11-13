const private = () => {
  return (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.render("index.hbs", { message: "You are not logged in!" });
    }
  };
};

module.exports = private;
