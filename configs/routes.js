const router = require("express").Router();
const usersController = require("../controllers/users.controllers")
const miscController = require("../controllers/misc.controller")

router.get("/", miscController.home);

router.get("/register", usersController.register);

router.post("/register", usersController.doRegister);

module.exports = router;