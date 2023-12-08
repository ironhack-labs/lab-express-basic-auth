const router = require("express").Router();
const userController = require("../controllers/users.controller");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("home");
});

//GET
router.get("/register", userController.register);

//POST
router.post("/register", userController.doRegister);

module.exports = router;
