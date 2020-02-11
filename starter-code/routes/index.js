const express = require("express");
const router = express.Router();

const signupRouter = require("./signup");
const loginRouter = require("./login");
const authenticationRouter = require("./authentication-route")

router.use("/signup", signupRouter);
router.use("/login", loginRouter);

router.use("/", authenticationRouter); // to access account via cookies

// home page
router.get("/", (req, res) => {
  res.render("index", { title: "Authentication Lab"});
});

authenticationRouter.get("/main", (req, res) => {
    res.render("main")
})

authenticationRouter.get("/private", (req, res) => {
    res.render("private")
})

authenticationRouter.get("/logout", (req, res) => {
    req.session.destroy( (err) => {
        res.redirect("/login")
    })
})

module.exports = router;
