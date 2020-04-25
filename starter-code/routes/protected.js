const express = require('express');
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");

router.get("/main", requireAuth, (req,res)=>{
    res.render("main.hbs")
})

router.get("/private", requireAuth, (req,res)=>{
    res.render("private.hbs")
})

module.exports = router;