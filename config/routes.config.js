const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require('../middlewares/auth.middleware');


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
// Auth

router.get("/signup", authMiddleware.isNotAuthenticated, authController.signup); 
router.post("/signup" , authController.doSignup);

module.exports = router;