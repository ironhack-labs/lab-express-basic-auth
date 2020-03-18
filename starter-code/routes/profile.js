const express = require("express");
const router = express.Router();  

router.get("/", (req,res)=> {
    res.render("user/profile.hbs");
})

module.exports = router;