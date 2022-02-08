//importaciones
const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authCtrl');

//router
//signup - obtener pagina
router.get('/signup', authController.register)

//signup - enviar formulario
router.post('/signup', authController.registerForm)

//login - obtener pagina
router.get('/signin', authController.signin)

//login - enviar formulario de logi
router.post('/signin', authController.signinForm)

//ruta signupcheck
router.get('/signupcheck', authController.getSignUpCheck)

//exportacion
module.exports = router