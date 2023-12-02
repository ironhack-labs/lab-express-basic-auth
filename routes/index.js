const router = require("express").Router();
const userController = require ("../controllers/user.controllers")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
router.get("/login", userController.login)
router.post("/login", userController.doLogin )
router.get("/register", userController.register)
router.post ("/register", userController.doRegister)


module.exports = router;
