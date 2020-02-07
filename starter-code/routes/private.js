router.get("/main", (req, res, next) => {
  if (!req.session.currentUser) return res.redirect("auth/login");
  res.render("/private/home");
});

router.get("/private", (req, res, next) => {
  if (!req.session.currentUser) return res.redirect("auth/login");
  res.render("private");
});
