const express = require("express");
const router = express.Router();  

router.get("/", (req,res)=> {
    res.render("user/private.hbs");
})

module.exports = router;