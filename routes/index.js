const router = require("express").Router();
const userController = require('../controllers/user.controllers')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// GET signup form page

router.get('/signup', userController.signup)

// POST data from the form

router.post('/signup', userController.doSignup)

module.exports = router;
