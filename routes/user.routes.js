// requerir
const router = require('express').Router()

// crear directorio middleware para importar aquí isLoogedIn,
// para restringir el paso determinadas rutas
const { isLoggedIn } = require('./../middleware/route-guard')

// enrutar

// la ruta del perfil lleva un middleware que comprueba si el usuario está loggeado
router.get('/main', isLoggedIn, (req, res, next) => {
    res.render('user/user-cat', { user: req.session.currentUser })
})

router.get('/private', isLoggedIn, (req, res, next) => {
    res.render('user/private', { user: req.session.currentUser })
})

// exportar
module.exports = router