const router = require("express").Router();

const { isLoggedIn } = require("./../middleware/route-guard");

router.get("/perfil", isLoggedIn, (req, res, next) => {
  res.render("users/user-profile", { user: req.session.currentUser });
});

router.get("/perfil/privado", isLoggedIn, (req, res, next) => {
  res.render("users/user-profile-private", { user: req.session.currentUser });
});
module.exports = router;
