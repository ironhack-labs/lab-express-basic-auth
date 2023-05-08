const express = require('express')
const { isLoggedIn } = require('../middlewares/route-guard')  //si quisiera hacer una página inicial de perfil, pondria aquí un require del loggin y lo pondría en el router
const router = express.Router()


//profile page

router.get("/perfil", isLoggedIn, (req, res, next) => {
    res.render("user/profile", { user: req.session.currentUser })
})


module.exports = router

//este pergil no existe, lo pongo como ejemplo