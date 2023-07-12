const router = require("express").Router();
const authController = require("../controllers/auth.controller");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/singup',authController.singup)
router.post('/singup',authController.doSingup)


module.exports = router;
