const express = require("express");
const Router = express.Router()

Router.get("/", (req, res) => res.render("home"));
Router.use((req, res, next) => {
    (req.session.currentUser) ? next(): res.redirect("/login")
})
Router.get("/private", (req, res) => res.render("private"))
Router.get("/main", (req, res) => res.render("main"))

module.exports = Router;