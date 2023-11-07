const router = require("express").Router();
const { isLoggedIn } = require('../middleware/route-guard')



router.get("/mi-perfil", isLoggedIn, (req, res, next) => {
    res.render("user/main", { user: req.session.currentUser })
})
router.get("/publica", (req, res, next) => {
    res.send('holi')
})

router.get("/privada", isLoggedIn, (req, res, next) => {
    res.render("/private", { user: req.session.currentUser })
})

module.exports = router