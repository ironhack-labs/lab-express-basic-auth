const router = require("express").Router();
const userController = require('../controllers/user.controller')

router.get("/signup", userController.signup);
router.post("/signup", userController.doSignup);

module.exports = router;