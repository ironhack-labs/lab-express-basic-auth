const router = require("express").Router();

const { isLoggedIn } = require('../middleware/route-guard')

router.get('/main', isLoggedIn, (req, res) => {
    res.render('random/main')
})
router.get('/private', isLoggedIn, (req, res) => {
    res.render('random/private')
})

module.exports = router;