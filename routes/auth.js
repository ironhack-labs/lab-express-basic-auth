const router = require("express").Router();

//CONTROLLERS:
const authController = require('../controllers/auth.controller');

//MIDDELWARES: 
const authMiddleware = require('../middlewares/auth.middelware')

//ROUTES:

//SIGN UP 
router.get('/signUp', authMiddleware.isNotAuthenticated, authController.signUp);
router.post('/signUp', authController.doSignUp);

//LOG IN
router.get('/login', authMiddleware.isNotAuthenticated, authController.login);
router.post('/login',  authController.doLogin);

//LOG OUT
router.get("/logout", authMiddleware.isAuthenticated, authController.logout);


// TO EXPORT ALL ROUTES:
module.exports = router;