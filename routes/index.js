const router = require("express").Router();

//Define the controllers 
const authController = require("../Controllers/auth.controller")
const miscController = require("../Controllers/misc.controller");
const usersController = require("../Controllers/users.controller");

//Define the middlewares
const authMiddlewares = require("../middlewares/auth.middleware");
const adminMiddlewares = require("../middlewares/admin.middleware");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


router.get("/", miscController.home);
router.get("/panel", adminMiddlewares.isAdmin, miscController.panel);


// Signup routes
router.get("/signup", authMiddlewares.isNotAuthenticated, authController.signup);
router.post("/signup", authMiddlewares.isNotAuthenticated, authController.doSignup);

// Login routes
router.get("/login", authMiddlewares.isNotAuthenticated, authController.login);
router.post("/login", authMiddlewares.isNotAuthenticated, authController.doLogin);

// Now the Logout part
router.get("/logout", authController.logout);

// Delete your profile
router.post("/users/delete/:id", adminMiddlewares.isAdmin, usersController.delete);

// and aha, this is the Profillleeee
router.get("/profile", authMiddlewares.isAuthenticated, usersController.profile);

// The main (protected)
router.get("/main", authMiddlewares.isAuthenticated, (req, res, next) => {
  res.render("user/main");
});

// Private (protected)
router.get("/private", authMiddlewares.isAuthenticated, (req, res, next) => {
  res.render("user/private");
});

module.exports = router;





