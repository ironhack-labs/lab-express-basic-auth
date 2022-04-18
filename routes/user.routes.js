const router = require('express').Router()

const { IsLoggedOut } = require('./../middleware/route-guard')

router.get('/mi-perfil', IsLoggedOut, (req, res) => {
    res.render('user/profile-view', { user: req.session.currentUser })
})
router.get('/main', IsLoggedOut, (req, res) => {
    res.render('./private/main-view', { user: req.session.currentUser })
})
router.get('/private', IsLoggedOut, (req, res) => {
    res.render('./private/private-view', { user: req.session.currentUser })
})

module.exports = router