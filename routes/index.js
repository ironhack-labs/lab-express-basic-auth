const router = require("express").Router();


const { isLoggedIn } = require('./../middleware/route-guard')

router.get("/", (req, res, next) => {
  res.render("index");

})

router.get("/mi-perfil", isLoggedIn, (req, res, next) => {
  res.render("user/private", { user: req.session.currentUser })
})

router.get("/main", isLoggedIn, (req, res, next) => {
  res.render("user/main", { user: req.session.currentUser })
})





module.exports = router;
