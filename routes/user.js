const express = require('express');
const { isLoggedIn } = require('../middlewares/route-guard');
const router = express.Router();


router.get("/private", isLoggedIn, (req, res) => {


    res.render("auth/profile", { loggedUser: req.session.currentUser });
})

module.exports = router
