const express = require('express');
const router = express.Router();

//Iteration 1: Required bycript
const bcrypt = require("bcrypt")
const bcryptSalt = 10

//Iteration 1: Requier the User Moderl
const User = require('./../models/User.model')

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));


/* Iteration 1: GET REGISTRO */
router.get('/registro', (req, res) => {
    // res.send('aquí viene el formulario de registro')
    res.render('registrar')
})



/* Iteration 1: Post Registro */
router.post('/registro', (req, res) => {
    // res.send('aquí te registras')
    // res.render('registrar')

    // Iteration 1: Get the user and pass value
    const {
        username,
        password
    } = req.body

    //Iteration 1: Show for console
    console.log(username, password)

    //Iteration 1: Encripty the pass
    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)

    // Iteration 1: create the user and pass in BBDD
    User
        .create({
            username,
            password: hashPass
        })
        .then(theUserCreated => {
            console.log('Se ha creado el usuario registrado', theUserCreated)
            res.redirect('/user-create')
        })
        .catch(err => console.log("Error", err))


})

router.get('/user-create', (req, res) => {
    res.render('user-create')
})


//Iteration 2: GET LOGIN */

router.get('/inicio-sesion', (req, res) => {
    res.render('login')
})

//Iteration 2: POST LOGIN */

router.post('/inicio-sesion', (req, res) => {

    const {
        username,
        password
    } = req.body

    User
        .findOne({
            username
        })

        .then((theUser) => {
            if (!theUser) {
                res.render("login", {
                    errorMsg: "Usuario no reconocido"
                });
                return;
            }
            console.log('xxxxxxxxxxxxxxxxx', theUser)

            //iteration 2: compare pass
            if (bcrypt.compareSync(password, theUser.password)) {
                req.session.currentUser = theUser;
                res.redirect("/user");
                console.log('1.este es el objeto', theUser)
            } else {
                res.render("login", {
                    errorMsg: "Contraseña incorrecta"
                });
                console.log('2.este es el objeto', theUser)
                return;
            }
        })
        .catch((err) => console.log("Error", err));
})

//sesion no iniciada
router.get("/noup", (req, res, next) => {
    res.render("session-noup");
});

//Sesión  a iniciado iniciada
router.use((req, res, next) => {
    if (req.session.currentUser) {
        next();
    } else {
        res.redirect("/noup");
    }
});


//sesión de usuario
router.get("/user", (req, res, next) => {
    res.render("login-user");
});

//cerrar sesion
router.get("/logout", (req, res, next) => {
    req.session.destroy((err) => {
        // cannot access session here
        res.redirect("/login");
    });
});


module.exports = router;