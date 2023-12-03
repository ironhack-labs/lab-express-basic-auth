const router = require("express").Router();
const userController = require ("../controllers/user.controllers")
const authMiddlewares = require("../middlewares/auth.middlewares");


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
router.get("/list", authMiddlewares.isAuthenticated, userController.list)
router.get("/login", userController.login)
router.post("/login", userController.doLogin)
router.get("/register", userController.register)
router.post ("/register", userController.doRegister)
router.get( "/profile", authMiddlewares.isAuthenticated, userController.profile);
router.get("/main", authMiddlewares.isAuthenticated, userController.main)
router.get("/private", authMiddlewares.isAuthenticated, userController.private)
router.get("/logout", authMiddlewares.isAuthenticated, userController.logout);



module.exports = router;
