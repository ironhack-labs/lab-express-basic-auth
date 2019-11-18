
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')



router.get("/signup", (req, res) => res.render("signup"))
router.post('/signup', (req, res) => {

    const { username, password } = req.body

    if (username === "" || password === "") {
        res.render("signup", { errorMessage: "Rellena ambos campos" })
        return
    } else {
        res.render("signup")
    }

    res.redirect("/")


})

module.exports = router;