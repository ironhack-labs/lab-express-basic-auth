const express = require("express");
const loginRouter = express.Router();
const User = require("./../models/User");

loginRouter.get("/", (req, res) => {
    res.render("login");
});

module.exports = loginRouter;