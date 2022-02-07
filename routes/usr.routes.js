const router = require("express").Router()
const {logueado} = require('../middleware/route-ward')

//no olvides pasar el objeto con el usuario guardado en req.session
router.get('/perfil',logueado, (req, res, next) => {
    console.log(req.session)
    res.render('user/user-profile', { user: req.session.currentUsr })
})

router.get('/fotos', logueado, (req, res, next) => {
    res.render('user/pictures', { user: req.session.currentUsr } )
})






module.exports = router

