const router = require("express").Router();
const authController = require('../controllers/auth.controller');

/* GET home page */

router.get('/', authController.index);


router.get('/signup', authController.create);
router.post('/signup', authController.doCreate);


router.get('/login', authController.login);
router.post('/login', authController.doLogin);


module.exports = router;
