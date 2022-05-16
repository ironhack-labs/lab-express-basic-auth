const router = require("express").Router()
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

router.get("/userProfile", isLoggedIn, (req, res) => {
    console.log("Los datos los tenemos aqui en session", req.session)
    res.render("users/user-profile", { currentUser: req.session.currentUser })
})

module.exports = router