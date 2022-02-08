//importaciones
const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authCtrl');

//router
//signup - obtener pagina
router.get('/signup', authController.register)

//signup - enviar formulario
router.post('/signup', authController.registerForm)


//exportacion
module.exports = router