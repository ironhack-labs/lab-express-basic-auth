const router = require("express").Router();
const userController = require ("../controllers/user.controller");

router.get("/login", userController.create);
router.post("/login", userController.doCreate);
router.get("/profile", userController.profile);

module.exports = router;