const express = require('express');
const router  = express.Router();

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/main", (req, res, next) => {
    if (!req.session.currentUser)
        return res.redirect("auth/login");

    return res.render("main");
});

router.get("/private", (req, res, next) => {
    if (!req.session.currentUser)
        return res.redirect("auth/login");

    return res.render("private");
});

module.exports = router;
