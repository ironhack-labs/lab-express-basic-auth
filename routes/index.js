const router = require("express").Router();
const usersController = require('../controllers/users.controller');
const authMiddlewares = require('../middlewares/auth.middlewares');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/register', usersController.register);
router.post('/register', usersController.doRegister);
router.get('/login', usersController.login);
router.post('/login', usersController.doLogin);
router.get('/profile', authMiddlewares.isAuthenticated, usersController.profile);
router.get('/main', authMiddlewares.isAuthenticated, usersController.main);
router.get('/private', authMiddlewares.isAuthenticated, usersController.private);
router.get('/logout', authMiddlewares.isAuthenticated, usersController.logout);

module.exports = router;
