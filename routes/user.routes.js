const router = require("express").Router();

const { isLoggedIn } = require('../midellware/router-guard')


router.get('/mi-perfil', isLoggedIn, (req, res) => {
    res.render("user/profile", { user: req.session.currentUser })
})
router.get('/private-content', isLoggedIn, (req, res) => {
    res.render('private/main')
})

router.get('/really-private-private', (req, res) => {
    res.render('private/private')

})

module.exports = router;