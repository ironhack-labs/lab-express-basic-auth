const router = require("express").Router();
const userController = require ("../controllers/user.controllers");
const authMiddleware = require("../middlewares/auth.middlewares")
/* GET home page */
router.get("/", userController.list);

router.get("/new", authMiddleware.isNotAuthenticated, userController.createUser);
router.post("/new", authMiddleware.isNotAuthenticated, userController.doCreateUser);

router.get("/login", authMiddleware.isNotAuthenticated, userController.login);
router.post("/login", authMiddleware.isNotAuthenticated, userController.doLogin);

router.get("/profile", authMiddleware.isAuthenticated, userController.viewProfile);

router.post("/logout", authMiddleware.isAuthenticated, userController.doLogOut);


module.exports = router;
