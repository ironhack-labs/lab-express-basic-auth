const router = require("express").Router();

//CONTROLLERS:
const authController = require('../controllers/auth.controller');


//ROUTES:

//SIGN UP 
router.get('/signUp', authController.signUp);
router.post('/signUp', authController.doSignUp);


module.exports = router;