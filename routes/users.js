const router = require("express").Router();

//CONTROLLER:
const usersController = require('../controllers/users.controller');

//MIDDELWARES: 
const authMiddleware = require('../middlewares/auth.middelware')

//ROUTES:

//PROFILE
router.get('/profile/:id', authMiddleware.isAuthenticated, usersController.profile);


//TO EXPORT ALL ROUTES:
module.exports = router;