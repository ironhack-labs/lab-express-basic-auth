const express = require("express")
const router = express.Router()

const usersController = require("./../controllers/usersController")

router.get("/", usersController.register)
router.get("/profile", usersController.viewProfile)

//verificación: verificar la identidad de un usuario


module.exports = router