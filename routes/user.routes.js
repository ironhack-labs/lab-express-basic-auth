const router = require('express').Router()

const { isLoggedIn } = require('./../middleware/route-guard')

router.get("/principal", isLoggedIn, (req, res) => {
    res.render("user/principal")
})

router.get("/privado", isLoggedIn, (req, res) => {
    res.render("user/privado")
})


module.exports = router