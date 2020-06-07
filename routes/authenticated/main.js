const express = require("express");
const app = express();

app.get("/authenticated/main", (req,res) => {
    res.render("authenticated/main");
})

module.exports = app;