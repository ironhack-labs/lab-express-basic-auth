const express = require('express');
const router = express.Router();

const loginRouter = require ("./log-in");
const signupRouter = require ("./sign-up");

router.use("/login", loginRouter);
router.use("/signup", signupRouter);

//logut
router.get("/logut", (req, res) => {
    req.session.destroy(err => {
        if (err){
            //if cannot to logout
            res.redirect("/");
        } else {
            res.redirect("/login");
        }
    });
});

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

module.exports = router;
