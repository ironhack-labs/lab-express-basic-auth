const express = require("express");
const app = express();

app.get("/cat", (req, res)=>{
    res.render("main")
})

module.exports = app;