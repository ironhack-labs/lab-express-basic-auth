const router = require("express").Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
/* GET home page */

router.get('/', authController.index);


router.get('/signup', authMiddleware.isNotAuthenticated, authController.create);
router.post('/signup', authMiddleware.isNotAuthenticated, authController.doCreate);


router.get('/login', authMiddleware.isNotAuthenticated, authController.login);
router.post('/login', authMiddleware.isNotAuthenticated, authController.doLogin);

router.get('/profile', authMiddleware.isAuthenticated, authController.profile);
router.get('/logout', authMiddleware.isAuthenticated, authController.logout);



module.exports = router;
