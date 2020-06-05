const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const User = require("../../models/User.model");

app.get("/logout", (req, res, next) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

module.exports = app;