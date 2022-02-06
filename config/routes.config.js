// requerimos router de express
const router = require('express').Router();

// requerimos controladores
const common = require('../controllers/common.controller')
const auth = require('../controllers/auth.controller')
const user = require('../controllers/user.controller')
const { isAuthenticated } = require('../middlewares/auth.middlewares')

// usamos rutas
router.get('/', common.home);

//register
router.get('/register', auth.register)
router.post('/register', auth.doRegister)
router.get('/login', auth.login)
router.post('/login', auth.doLogin)
router.get('/logout', auth.logout)

router.get('/profile', isAuthenticated, user.profile)
// exportamos el modulo
module.exports = router