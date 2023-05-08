const express = require('express')
const router = express.Router();
const { isLoggedIn } = require('../../middlewares/route-guard')
const User = require('../../models/User.model')


// profile page
router.get("/perfil", isLoggedIn, (req, res, next) => { //si el usuario esta loggeado
    res.render("user/profile", { user: req.session.currentUser })
})

router.get("/privado", isLoggedIn, (req,res, next) => {
    res.render("user/private")
})

module.exports = router;