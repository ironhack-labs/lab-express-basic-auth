const express = require('express');

const router = express.Router();

const bcrypt = require("bcrypt");

const User = require("../models/user-model.js")


router.get("/signup", (req, res, next) => {

    res.render("auth-views/signup-form.hbs")
})

router.post("/process-signup", (req, res, next) => {

    const { userName, originalPassword } = req.body;

    const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

    User.create({ userName, encryptedPassword })
        .then(userDoc => {
            res.redirect("/");
        })
        .catch(err => next(err))

})

router.get("/login", (req, res, next) => {

    res.render("auth-views/login-form.hbs")
})


router.post("/process-login", (req, res, next) => {

    const { userName, originalPassword } = req.body;

    User.findOne({ userName: { $eq: userName } })
        .then(userDoc => {
            if (!userDoc) {
                res.redirect("/login");
                return;
            }

            const { encryptedPassword } = userDoc;
            if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
                res.redirect("/login");
                return;
            }
            res.redirect("/");


        })
        .catch(err => next(err))

})




module.exports = router;