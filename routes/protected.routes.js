const express = require('express');
const router = express.Router();

const isLoggedIn = require("../middleware/isLogged");

router.get("/cat", isLoggedIn, (req, res, next) => {
    res.render("protected/cat", {username: req.session.currentUser});
})

router.get("/secret", isLoggedIn, (req, res, next) => {
    res.render("protected/secret", {username: req.session.currentUser});
})

module.exports = router;
