const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/signup", (req, res, next) => {
    res.render("signup");
});

router.post("/signup", (req,res) => {
    const {username, password} = req.body;
    // console.log(username, password);
    if (password.length < 8) {
        res.render("signup");
    }
});

module.exports = router;
