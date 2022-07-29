const router = require("express").Router();

//CONTROLLERS:
const userControllers = require('../controllers/user.controller');


//ROUTES:

//SIGN UP 
router.get('/signUp', userControllers.signUp);
router.post('/signUp', userControllers.doSignUp);


module.exports = router;