// requerimos router de express
const router = require('express').Router();

// requerimos controladores
const common = require('../controllers/common.controller')
const auth = require('../controllers/auth.controller')

// usamos rutas

router.get('/', common.home);



// exportamos el modulo
module.exports = router