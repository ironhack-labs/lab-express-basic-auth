const express = require('express')
const { isLoggedIn } = require("../middlewares/route-guard")
const router = express.Router()


// perfil, tiene que existir una sesion abierta sino, por el middle te manda a login, si es correcto te manda a tu perfil
router.get("/profile", isLoggedIn , (req, res, next) => {
  
  res.render("user/profile-page", { user: req.session.currentUser })
})

router.get("/edit-profile", isLoggedIn, (req, res, next) => {
    //res.send("PAGINA DE EDITAR PERFIL")
    res.render("user/profile-edit")
})

module.exports = router