const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const userController =require("../controllers/users.controller");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("home");
});

//GET
router.get("/login", authController.login);
router.post("/login", authController.dologin)
router.get("/register", authController.register);

//POST
router.post("/register", authController.doRegister);

router.get("/profile", userController.profile);

module.exports = router;
