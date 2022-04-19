const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");

router.get("/register", (req, res, next) => {
    res.render("auth/signup");
});

router.post("/register", (req, res, next) => {
    const { username, plainPassword } = req.body;

    if (username.length === 0 || plainPassword.length === 0) {
        res.render("auth/login", { errorMessage: "Rellena todos los campos" });
        return;
    }

    bcryptjs
        .genSalt(saltRounds)
        .then((salt) => bcryptjs.hash(plainPassword, salt))
        .then((hashedPassword) =>
            User.create({ username, password: hashedPassword })
        )
        .then(() => res.redirect("/login"))
        .catch((error) => next(error));
});

router.get("/login", (req, res) => {
    res.render("auth/login");
});

router.post("/login", (req, res, next) => {
    const { username, plainPassword } = req.body;

    if (username.length === 0 || plainPassword.length === 0) {
        res.render("auth/login", { errorMessage: "Rellena todos los campos" });
        return;
    }

    User.findOne({ username })
        .then((user) => {
            if (!user) {
                res.render("auth/login", {
                    errorMessage: "Usuario no reconocido",
                });
                return;
            }

            if (!bcryptjs.compareSync(plainPassword, user.password)) {
                res.render("auth/login", {
                    errorMessage: "Contraseña no válida",
                });
                return;
            }

            req.session.currentUser = user; // <= THIS means logging in a user
            res.redirect("/main");
        })
        .catch((error) => next(error));
});

module.exports = router;
