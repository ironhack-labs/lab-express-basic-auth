const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
    res.render("index");
});

//middleware (just a function) to protect a route
function loginCheck() {
    return (req, res, next) => {
        //check if we have a logged in user
        if (req.session.user) {
            //the user, who is making the request, is logged in
            //user can proceed
            next()
        } else {
            //user is not logged in
            res.redirect("/log-in")
        }
    }
}

router.get("/private", loginCheck(), (req, res, next) => {
    //to set a cookie
    res.cookie("myCookie", "hello from express")
        //access the cookie -> req.cookies
    console.log("this is the cookie: ", req.cookies)
    const user = req.session.user
    res.render("private", { user: user })
})

//Iteration 3 | Protected Routes - middleware to protect a route

module.exports = router;