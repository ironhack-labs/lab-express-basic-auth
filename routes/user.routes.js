const bcryptjs = require("bcryptjs");
const isLoggedOut = require("../middlewares/isLoggedOut");
const isLoggedIn = require("../middlewares/isLoggedIn");
const User = require("../models/User.model");
const { rawListeners } = require("../models/User.model");
const router = require("express").Router();

router.get("/profile", isLoggedIn, (req, res,) => {
    res.render("profile", {userEmail: req.session.user.email});
});

router.get("/main", isLoggedIn, (req, res,) => {
    res.render("main");
});

router.post("/logout", (req, res, next) => {
    req.session.destroy((err) => {
        if(err) {
            next(err);
            return;
        }
        res.redirect("/")
    });
})

//  route to sigunp Page 
router.get('/signup', isLoggedOut, (req,res) => {
    res.render("auth/signup");
});

router.post('/signup', async (req,res) => {
    const salt = await bcryptjs.genSalt(12);
    const hash = await bcryptjs.hash(req.body.password, salt);
    const user = new User({ email: req.body.email, password: hash});
    await user.save();

    // res.send("<h1>Signed up</h1>")
    res.redirect("/login");
});

// route to Login

router.get("/login", isLoggedOut, (req, res) => {
    res.render("auth/login")
});

router.post("/login", async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});

        if(!user) {
            return res.render("auth/login", {error: "User not existent!"});
        }

        const passwordsMatch = await bcryptjs.compare(
            req.body.password, user.password
        );

        if(!passwordsMatch) {
            return res.render("auth/login", {error: "Sorry the password is incorrect!"})
        }

        req.session.user = {
            email: user.email,
        };

        res.redirect("/profile");
    } catch (err){ 
        next(err);
    }
})



module.exports = router;