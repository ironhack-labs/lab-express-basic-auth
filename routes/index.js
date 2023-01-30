const router = require("express").Router();
const authController = require("../controllers/auth.controller") 

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//AUTH
router.get('/signup', authController.signup);
router.post('/signup', authController.doSignup);


module.exports = router;
