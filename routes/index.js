const router = require("express").Router();
const usersController = require('../controllers/users.controller');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// User routes

router.get('/signup', usersController.signup);
router.get('/signin', usersController.signin);
router.post('/signin', usersController.dosignin);
router.post('/signup', usersController.dosignup);


module.exports = router;
