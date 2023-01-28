const router = require("express").Router();

const userController = require("../controllers/user.controller")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", userController.signup)
router.post("/signup", userController.doSignup)

module.exports = router;
