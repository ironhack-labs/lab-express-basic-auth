const express = require
//const router = express.Router()
const { isLoggedIn } = require('../middleware/routh-guard')


router.get("/profile", isLoggedIn, (req, res) => {
    res.render("/user/user", { user: req.session.currentUser })

})


module.exports = router
