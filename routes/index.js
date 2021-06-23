const router = require("express").Router();

const userController = require("../controllers/user.controller")

/* GET home page */
router.get("/", userController.home)

router.get("/new", userController.new)
router.post("/new", userController.create)

router.get("/user/:id", userController.id)

router.get("/user/edit", userController.edit)
router.post("/user/edit", userController.update)

module.exports = router;
