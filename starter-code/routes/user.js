const express = require('express');
const app = express()
const Users = require("../models/User")


app.get("/signup", (req, res) => {
    res.render("user/signup");
})
app.post("/signup", (req, res) => {
    const { username, password } = req.body;
    username
        .create({
            username: username,
            password: password
        })
        .then((user) => {
            res.redirect("/user/login");
        })
        .catch((error) => {
            res.send("user not created", error);
        })
})

// router.get("/login", (req, res) => {
//     res.render("user/login");
// })
// router.post("/login", (req, res) => {
//     const { username, password } = req.body;
//     User.findOne({
//             username
//         })
//         .then((user) => {
//             if (!user) res.send("invallied credentials.")
//             else if (user.password !== password) res.send("invalied credentials.");
//             else {
//                 res.redirect("/user/profile");
//             }
//         })
//         .catch((error) => {
//             res.send("error, not logging in.")
//         })
// })


module.exports = app.js;