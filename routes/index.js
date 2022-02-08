//importaciones
const express = require('express');
const router = express.Router();
const indexController = require('./../controllers/indexCtrl')

//ruta index
router.get('/', indexController.getHome)

//ruta profile 
router.get('/profile', indexController.getProfile)

//exportacion
module.exports = router