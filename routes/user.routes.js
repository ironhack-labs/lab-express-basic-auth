const express = require('express');
const { isLoggedIn } = require('../middlewares/route-guard');
const router = express.Router();

router.get("/user/main", isLoggedIn, (req, res) => {

    res.render("user/main", { loggedUser: req.session.currentUser });
})

router.get("/user/private", isLoggedIn, (req, res) => {

    res.render("user/private", { loggedUser: req.session.currentUser });
})

module.exports = router