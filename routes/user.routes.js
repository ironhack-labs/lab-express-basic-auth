const express = require('express');
const { isLoggedIn } = require('../middlewares/route-guard');
const router = express.Router();


router.get("/my-profile", isLoggedIn, (req, res) => {

    console.log('EL USUARIO LOGUEADO ES', req.session.currentUser)

    res.render("user/profile", { loggedUser: req.session.currentUser });
})

module.exports = router
