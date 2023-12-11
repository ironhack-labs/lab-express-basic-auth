const router = require("express").Router();
const userController = require("../controllers/user.controllers");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/register", userController.register);
router.post("/register", userController.doRegister);
router.get("/login", userController.login);

module.exports = router;
