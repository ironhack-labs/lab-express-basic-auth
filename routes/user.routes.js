const router = require('express').Router()

router.get("/userProfile", (req, res) => {
    res.render("users/user-profile")
})

module.exports = router