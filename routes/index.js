const router = require("express").Router();
const userController = require ("../controllers/user.controllers");
/* GET home page */
router.get("/", userController.list);

router.get("/new", userController.createUser);
router.post("/new", userController.doCreateUser);

module.exports = router;
