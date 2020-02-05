module.exports = function exposeFlash(req, res, next) {
  res.locals.success_msg = req.flash("Success");
  res.locals.error_msg = req.flash("Error");
  next();
};