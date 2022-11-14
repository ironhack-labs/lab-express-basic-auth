const router = require("express").Router()

router.get("/", (req, res) => {
    res.render("home")      // prueba de clase 
})

router.get("/user.routes", (req, res) => {
    res.render("user.routes")
})
router.get("/auth.routes", (req, res) => {
    res.render("auth.routes")
})

module.exports = router