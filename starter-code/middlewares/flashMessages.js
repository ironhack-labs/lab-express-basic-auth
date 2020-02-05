module.exports = function(req, res, next) {
  res.locals.succes_message = req.flash("success");
  res.locals.error_message = req.flash("error");
  next();
};
