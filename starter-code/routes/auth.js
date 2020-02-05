const express = require("express");
const router = express.Router();
const userModel = require("../models/User");
const bcrypt = require("bcrypt"); // intro to bcrypt hashing algorithm https://www.youtube.com/watch?v=O6cmuiTBZVs
const privateRoute = require("../middlewares/privateRoute");

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post("/login", (req, res) => {
    const user = req.body

    if(!user.username || !user.password) {
        return res.redirect("/admin/login");
    } else {
        userModel
            .findOne({username: user.username})
            .then(dbRes => {
                if(!dbRes) {
                    console.log("something went wrong");
                    return res.redirect("/admin/login")
                }

                if(bcrypt.compareSync(user.password, dbRes.password)) {
                    req.session.currentUser = {
                        username: dbRes.username,
                        password: dbRes.password
                    }
                    console.log("je suis connecté")
                return res.redirect("/")
                } else {
                    return res.redirect("/admin/login")
                }
            })
            .catch(dbErr => console.error(dbErr));
    };  
});

router.get("/signup", (req, res) => {
    res.render("auth/signup");
})

router.post("/signup", (req, res) => {
    const user = req.body;
    if(!user.username || !user.password) {
        return res.redirect("/admin/signup");
    } else {
        userModel
            .findOne({username: user.username})
            .then(dbRes => {
                if (dbRes) return res.redirect('/admin/signup');

                const salt = bcrypt.genSaltSync(10);
                const hashed = bcrypt.hashSync(user.password, salt);
                user.password = hashed;

                userModel
                    .create(user)
                    .then(() => res.redirect("/admin/login"))
            })
            .catch(dbErr => console.error(dbErr));
    }
});

router.get("/main", (req, res) => {
    res.render("main");
});

router.get("/private", privateRoute, (req, res) => {
    res.render("private")
})

module.exports = router;