const router = require("express").Router();
const usersController = require("../controllers/users.controllers");
const authMiddleware = require("../middlewares/auth.middleware")
/* GET home page */
router.get("/", usersController.index);
router.get("/list", usersController.list);

router.get("/create", authMiddleware.isNotAuthenticated, usersController.create);
router.post("/create", authMiddleware.isNotAuthenticated, usersController.doCreate);

router.get("/login", authMiddleware.isNotAuthenticated, usersController.login);
router.post("/login", authMiddleware.isNotAuthenticated, usersController.doLogin);

router.get("/profile", authMiddleware.isAuthenticated, usersController.profile);

router.post("/logout", authMiddleware.isAuthenticated, usersController.logout)

module.exports = router;
