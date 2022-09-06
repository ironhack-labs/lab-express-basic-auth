const router = require("express").Router();
const UserModel = require("../models/user.model")
const bcrypt = require("bcrypt");

router.get("/signup", (req, res) => {

    res.render("auth/signup")
})

router.get("/login", (req, res) => {

    res.render("auth/login");
})


router.post("/signup", (req, res, next) => {
    const { password, username } = req.body;
    console.log(password);
    bcrypt
        .genSalt(10)
        .then((salts) => {
            return bcrypt.hash(password, salts);
        })
        .then((pass) => {
            return UserModel.create({ password: pass, username })
        })
        .then((user) => {

            res.redirect("/");

        })
        .catch((err) => next(err));


});

router.get("/profile", (req, res) => {

    res.render("user/profile");
})

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

router.post("/login", (req, res, next) => {

    const { username, password } = req.body;
    console.log("this is the password : " + password);

    let user;
    UserModel.findOne({ username })
        .then((userDb) => {
            //res.json(userDb);
            user = userDb;
            return bcrypt.compare(password, userDb.password);
        })
        .then((isPassword) => {

            if (isPassword) {
                console.log(isPassword);
                req.session.user = user;
                res.redirect("/profile")
            } else {
                res.render("login", { message: "Password or user incorrect" });
            }
        })
        .catch((err) => next(err));
})


module.exports = router;