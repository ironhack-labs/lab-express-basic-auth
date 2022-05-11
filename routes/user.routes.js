
// importar metodo router para crear la ruta
const router = require("express").Router()

router.get("/userProfile", (req,res,next) => {
    res.render("users/user-profile")
})

// exportar ruta en router
module.exports = router