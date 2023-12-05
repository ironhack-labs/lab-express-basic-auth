const router = require("express").Router();
const usersController = require('../controllers/users.controller');
const authMiddlewares = require("../middlewares/auth.middlewares");


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// User routes

router.get('/signup', usersController.signup);
router.get('/signin', usersController.signin);
router.post('/signin', usersController.dosignin);
router.post('/signup', usersController.dosignup);
router.get('/profile',authMiddlewares.isAuthenticated, usersController.profile);
router.get("/main", authMiddlewares.isAuthenticated, usersController.main);
router.get("/private", authMiddlewares.isAuthenticated, usersController.private)
router.get("/logout", authMiddlewares.isAuthenticated, usersController.logout);




module.exports = router;
