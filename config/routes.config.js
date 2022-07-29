const router = require("express").Router();
const miscController = require("../controllers/misc.controller");
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");

router.get("/", miscController.index);

//AUTHENTICATION
router.get("/register", authController.register);
router.post("/register", authController.doRegister);

//USER
router.get("/profile", userController.profile);

module.exports = router;
