const express = require("express")
const router = express.Router()

const usersController = require("../controllers/users.controller")

/* GET home page */
router.get("/", (req, res, next) => res.render("index"))

router.get("/signup", usersController.signUp)
router.post("/users", usersController.newUser)
router.get('/login',usersController.logIn)
router.post('/welcomeuser',usersController.welcomeUser)

module.exports = router
