const express = require("express")
const router = express.Router()

const usersController = require("./../controllers/usersController")

router.get("/", usersController.register)

//verificación: verificar la identidad de un usuario


module.exports = router