const router = require("express").Router();
const authController = require("../controllers/auth.controller");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("home");
});

//GET
router.get("/register", authController.register);

//POST
router.post("/register", authController.doRegister);

module.exports = router;
