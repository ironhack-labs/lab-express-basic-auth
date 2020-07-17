const express = require("express")
const router = express.Router()

const usersController = require("../controllers/users.controller")
const sessionMiddleware = require('../middlewares/session.middleware')
/* GET home page */
router.get("/", (req, res, next) => res.redirect("/welcome"))

router.get("/signup", sessionMiddleware.isNotAuthenticated, usersController.signUp)
router.post("/newUser", sessionMiddleware.isNotAuthenticated, usersController.newUser)
router.get('/login',sessionMiddleware.isNotAuthenticated, usersController.logIn)
router.post('/doLogIn',sessionMiddleware.isNotAuthenticated, usersController.doLogIn)
router.get('/welcome',sessionMiddleware.isAuthenticated, usersController.welcome)
router.get('/logout',sessionMiddleware.isAuthenticated, usersController.logout)
module.exports = router
