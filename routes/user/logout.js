const express = require("express");
const app = express();

app.get("/user/logout", (req,res) => {
    req.session.destroy();
    res.redirect("/");
})

module.exports = app;