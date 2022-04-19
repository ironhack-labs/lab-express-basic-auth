const router = require('express').Router()

const req = require('express/lib/request')

const { isLoggedIn } = require('./../middleware/route-guard')

router.get('/perfil-usuario', (req, res) => {
    res.render('user/profile', { user: req.session.currentUser })
    // res.send('probandso profile')
})





module.exports = router