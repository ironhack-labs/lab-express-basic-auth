const router = require("express").Router();

const { isLoggedIn } = require('./../middleware/session-guard')


router.get("/main", (req, res) => {

    res.render("main")

})

router.get("/private", isLoggedIn, (req, res) => {

    res.render("private")

})


module.exports = router