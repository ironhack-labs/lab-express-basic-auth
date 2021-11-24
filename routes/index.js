const router = require("express").Router();
const authController = require("./../controllers/authController");
/* GET home page */
//Mostrar formulario
router.get("/", authController.viewRegister);

//Enviar datos del form a la DB
router.post("/", authController.register);

module.exports = router;
