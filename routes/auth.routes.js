const express = require('express');
const router = express.Router()

const authCtrl = require('../controllers/auth.controller');

// Router
// A1. Signup - Obtener página
router.get('/register', authCtrl.register)

// A2. Signup - Enviar Formulario
router.post('/register', authCtrl.registerForm)

// B. Login - Obtener página
// router.get('/login', authCtrl.login)

// Exportaciones
module.exports = router;
