const {Router} = require("express");
const router = Router();


router.get("/main", (req, res) => {
    res.status(200).render('users/main')
} );

router.get("/private", (req, res) => {
    res.status(200).render('users/private')
} );

module.exports = router;