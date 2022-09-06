const router = require("express").Router();


router.get("/main", (req, res) => {
    res.render("private/main")
})

router.get("/private", (req, res) => {
    res.render("private/private")
})



module.exports = router;