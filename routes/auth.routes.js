const router = require('express').Router();
const User = require("../models/User.model")
const bcryptjs = require("bcryptjs");

router.get("/createUser", (req, res, next) => {
    res.render("auth/signup");
});


router.post("/createUser", async (req, res, next) => {
    const {
        username,
        password,
        ...rest
    } = req.body
    try {
        const salt = bcryptjs.genSaltSync(10)
        const newPassword = bcryptjs.hashSync(password, salt)

        const user = await User.create({
            username,
            password: newPassword
        })

        res.redirect(`/profile/${user._id}`)

    } catch (error) {
        console.log("error:", error)
        res.send("ya une erreurrrrr")
    }

})


router.get("/profile/:id", (req, res, next) => {

    User.findById(req.params.id)
        .then(user => {
            console.log("user1", user)
            const userPass = user.toObject()
            delete userPass.password
            console.log("user2", userPass)
            res.render("profile", {
                user: userPass
            })
        })
        .catch(error => {
            console.log("error:", error)
            res.send("El error!!!")
        })
})

module.exports = router;