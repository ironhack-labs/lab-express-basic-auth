const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
    console.log(req.body) // debug
});

router.get("/login", (req, res, next) => {
  res.render("auth/login", {});
});

router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    // if user doesn't exist
    if (!existingUser) {
        console.log("MESSAGE: User does not exist");
        return res.redirect("/auth/login");
    }

    // if password missmatch
    if (!checkHashed(password, existingUser.password)) {
        console.log("MESSAGE: Password missmatch");
        return res.redirect("/auth/login");
    }

    // Successful login
    console.log(`User ${existingUser.email}, has logged in succesfully`);
    req.session.currentUser = existingUser;
    return res.redirect("/");
});

module.exports = router;
