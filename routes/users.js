const express = require('express');
const router = express.Router();


const usersController = require('./../controllers/usersController')

const routeGuard = require('./../middlewares/route-guard')

// Ruteo
router.get('/profile', routeGuard.usuarioLoggeado, usersController.profile);
module.exports = router;

router.get('/main', routeGuard.usuarioLoggeado, usersController.main);
module.exports = router;


router.get('/private', routeGuard.usuarioLoggeado, usersController.private);
module.exports = router;
