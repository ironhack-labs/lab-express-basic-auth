const router = require("express").Router();
const { isLoggedIn, privateMustLogIn, isLoggedInTrue } = require('./../middleware/route-guard')

router.get("/perfil", isLoggedIn, (req, res, next) => {
    res.render("./pages/profile", { user:req.session.currentUser });
  })

router.get("/main", (req, res, next) => {
    res.render("./pages/main");
  })

router.get("/private", privateMustLogIn, (req, res, next) => {
    res.render("./pages/private");
  })

router.post("/cerrar-sesion", (req, res, next) => {
    req.session.destroy(()=> res.redirect("/main"))
  })


  module.exports = router;