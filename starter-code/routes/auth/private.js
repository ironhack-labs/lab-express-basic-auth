const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    if (req.session.currentUser) {
        console.log(req.session.currentUser)
        next();
    } else {
        console.log("you are not logged in")
        res.redirect("/login")
    }
})

router.get("/private", (req, res, next) => {
    res.render("private")
}
)

module.exports = router;