const router = require("express").Router();
const userControllers = require('../controllers/user.controllers')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/signUp', userControllers.signup)
router.post('/signUp', userControllers.doSignUp)

module.exports = router;
