const router = require("express").Router();
const User = require("../models/User.model")
const bcryptjs = require("bcryptjs")



//signup
router.get("/createUser", (req, res, next) => {
    res.render("auth/signup");
});

router.post("/createUser", async(req, res, next) => {
    //destructuring
    const {email, username, password, ...rest} = req.body
    try{
        const salt = bcryptjs.genSaltSync(10)
        const newPassword = bcryptjs.hashSync(password,salt)
        const user = await User.create({email, username, password: newPassword })
        res.redirect(`/profile/${user._id}`)

    }catch(error){
        console.log("error:",error)
        res.send("Error amigos!!!")
    }

})

//login
router.get("/login", (req, res, next) => {
    res.render("auth/login");
});


router.post("/login", async(req, res, next) => {
    //destructuring
    const {email, username, password, ...rest} = req.body
    try{
        User.findOne({ email })
            .then(user => {
                if(!user){
                    res.render('auth/login', {
                        errorMessage: "Invalid email/password. Verify you are using the correct ones."
                    })
                } else if (bcryptjs.compareSync(password, user.password)) {
                    req.session.currentUser = user;
                    console.log('CURRENT USER =============>',req.session.currentUser)
                    res.redirect(`/userProfile`)
                } else {
                    res.render('auth/login', {
                        errorMessage: "Invalid email/password. Verify you are using the correct one."
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })

    }catch(error){
        console.log("error:",error)
        res.send("Error amigos!!!")
    }

})


// profile

router.get('/userProfile', (req, res) => {
    res.render('user-profile', { userInSession: req.session.currentUser });
});
module.exports = router;