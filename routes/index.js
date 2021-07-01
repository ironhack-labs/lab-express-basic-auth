const router = require("express").Router();
const userController = require ("../controllers/user.controllers");
/* GET home page */
router.get("/", userController.list);

router.get("/new", userController.createUser);
router.post("/new", userController.doCreateUser);

router.get("/login", userController.login);
router.post("/login", userController.doLogin);

router.get("/profile", userController.viewProfile);

router.post("/logout", userController.doLogOut);

module.exports = router;
