const express = require('express')
const router = express.Router()



// Middleware 
router.use((req, res, next) => req.session.currentUser ? next() : res.render("login-page", { errorMessage: "Login to access" }))

// Private rutes
router.get("/main", (req, res) => res.render("main-page"))

router.get("/private", (req, res) => res.render("private-page", req.session.currentUser))


// Logout
router.get("/logout", (req, res) => req.session.destroy(() => res.redirect("/login")))


module.exports = router