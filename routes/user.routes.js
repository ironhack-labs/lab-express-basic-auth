const express = require('express');
const { isLoggedIn } = require('../middlewares/route-guard');
const router = express.Router();


router.get("/private", isLoggedIn, (req, res, next) => {


    res.render("auth/private");
})

router.get("/main", isLoggedIn, (req, res, next) => {


    res.render("auth/main");
})

module.exports = router