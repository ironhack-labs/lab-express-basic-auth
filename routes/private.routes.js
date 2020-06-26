const express = require('express')
const router = express.Router()

router.use((req, res, next) => {
    if (req.session.currentUser) {
        next()
    } else {
        res.render("auth/login", {
            errorMsg: "You can't enter there! >_<"
        })
    }
})
router.get("/private", (req, res) => {
    res.render('profile/private', req.session.currentUser)
});
router.get("/main", (req, res) => {
    res.render('profile/main', req.session.currentUser)
});

module.exports = router;