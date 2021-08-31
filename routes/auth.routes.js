const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { isLoggedOut } = require("../middleware/route-guard");

const User = require("../models/User.model");

// GET Log in page
router.get("/auth/login", (req, res, next) => {
    // console.log("Our session:", req.session);
    if (req.session && req.session.user) {
        // req.session?.user
        res.render("index", req.session.user);
    } else {
        res.render("auth/login");
    }
});   

// GET Sign up
router.get("/auth/signup", isLoggedOut, (req, res, next) => {
    res.render("auth/signup");
});

// POST Login
router.post('/auth/login', (req, res, next) => {
    const { username, password } = req.body;

    if (username === "" || password ==="") {
        res.render("index", { errorMessage: "Please enter both a username and password to login." });
    }; 

    User.findOne({ username })
    .then((userFromDB) => {
        if (!userFromDB) {
            res.status(500).render("index", { errorMessage: "Incorrect login credentials" })
        } else if (bcrypt.compareSync(password, userFromDB.password)) {
            // console.log(req.session)
            req.session.user = userFromDB;
            res.status(200).render("user/profile", userFromDB);
        } else {
            res.status(500).render("index", { errorMessage: "Incorrect login credentials"});
        }
    })
});

// POST Sign up
router.post("/auth/signup", (req, res, next) => {
    // console.log("Body", req.body);
    const { username, password } = req.body;
    User.findOne({ username })
    .then((userFromDB) => {
        if (!userFromDB) {
            const hashedPassword = bcrypt.hashSync(password, 10);
            User.create({ username, password: hashedPassword })
            .then((responseFromDB) => {
                res.render("index", responseFromDB);
            })
        } else {
        res.render("index", { errorMessage: "Username already exists"})
        };
    });
});



module.exports = router;