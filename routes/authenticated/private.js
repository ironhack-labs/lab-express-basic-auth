const express = require("express");
const app = express();

app.get("/authenticated/private", (req,res) => {
    res.render("authenticated/private");
})

module.exports = app;