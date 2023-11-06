const router = require("express").Router();

const { isLoggedIn } = require('../middleware/route-guard')

router.get('/privado', isLoggedIn, (req, res) => {
    res.render('user/private.hbs')


})


router.get('/home-page', (req, res) => {
    res.render('user/main.hbs')
})

module.exports = router;
