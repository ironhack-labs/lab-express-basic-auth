const router = require("express").Router();
const express = require("express");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


const authRouter = require("./auth.routes.js")
router.use("/auth", authRouter)


module.exports = router;