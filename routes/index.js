const router = require("express").Router();
const AuthController = require("../controllers/auth.controller");

/* GET home page */
router.get("/", AuthController.index);

router.get("/signup", AuthController.signup);
router.post("/signup", AuthController.doSignup)

module.exports = router;
