const User = require("../models/User.model");

const router = require("express").Router();

const bcryptjs = require('bcryptjs');
const { find } = require("../models/User.model");
const saltRounds = 10


//function to enable/disable buttons
//por alguna razon si la ejecuto, me dice que document is not defined
//la pensaba ejecutar al loguearse y desloguearse el usuario

// function buttonToggle() {
//     let login = document.querySelector(".log-in")
//     let signin = document.querySelector(".sign-up")
//     let logout = document.querySelector(".log-out")

//     login.classList.toggle("disabled")
//     signin.classList.toggle("disabled")

//     logout.classList.toggle("disabled")
//     logout.classList.toggle("blue")
//     logout.classList.toggle("btn-light")
//     logout.classList.toggle("btn-primary")
// }


// sign up

router.get("/signUp", (req, res, next) => {
    res.render("./auth/sign-up")
});

router.post("/signUp", (req, res, next) => {
    const { username, pwd1, pwd2 } = req.body

    //error handling

    User.findOne({ username })
        .then(result => {
            if (result.username === username) {
                res.render("./auth/sign-up", { errorMessage: "the username is already used" })
                return
            }

            if (username.length === 0 || pwd1.length === 0 || pwd2.length === 0) {
                res.render("./auth/sign-up", { errorMessage: "please fill al the fields" })
                return
            }
            if (pwd1 !== pwd2) {
                res.render("./auth/sign-up", { errorMessage: "the passwords do not match" })
                return
            }
            //pasword encryption
            bcryptjs
                .genSalt(saltRounds)
                .then(salt => bcryptjs.hash(pwd1, salt))
                .then(hashedPassword => {
                    return User.create({ username, password: hashedPassword })
                })

                .then(() => res.redirect('/'))
                .catch(error => next(error))
        })


})


//log in

router.get("/logIn", (req, res, next) => {
    res.render("auth/log-in")
})

router.post("/logIn", (req, res, next) => {
    const { username, pwd1 } = req.body
    if (username.length === 0 || pwd1.length === 0) {
        res.render('auth/log-in', { errorMessage: 'fill all the fields' })
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (!user) {
                res.render('auth/log-in', { errorMessage: 'user not found' })
                return
            }
            else if (bcryptjs.compareSync(pwd1, user.password) === false) {
                res.render('auth/log-in', { errorMessage: 'wrong password' })
                return
            }
            else {
                req.session.currentUser = user

                res.redirect('/')


                // buttonToggle()

            }
        })


});

// log-out



router.post('/logOut', (req, res) => {
    req.session.destroy(() => res.redirect('/logIn'))
})



module.exports = router;