const express = require('express');
//À utiliser lorsque nous avons les routes qui ne sont pas dans le fichier principal "app.js"
const router = express.Router();

//User model
const User = require('../models/User.model');

//Bcrypt for encrypting password
const bcrypt = require('bcryptjs');
const bcryptSalt = 10;

//Si nous visitons /signup, il va aller chercher (get) le fichier auth/signup.hbs et l'afficher à l'écran
router.get('/signup', (req, res, next) => {
    res.render('auth/signup.hbs');
});

//Comme notre form de signup.hbs est en method="POST" et action /signup, on fait un router.post pour récupérer toutes les infos
router.post('/signup', (req, res, next) => {
    //Récupérer les données du formulaire
    const {
        username,
        password
    } = req.body; //Body de l'input

    //Si les champs username ou password ne sont pas renseignés
    if (req.username === '' || req.password === '') {
        res.render('auth/signup', {
            errorMessage: 'Indicate a username and a password'
        })
        return;
    }

    //Si le user existe déjà
    User.findOne({
            username
        })
        .then((user) => {
            //Si le user est différent de "null" ça veut dire qu'il existe déjà
            if (user !== null) {
                res.render('auth/signup', {
                    //errorMessage est déjà déclaré dans signup.hbs
                    errorMessage: 'The user already exists'
                });
                return;
            }

            //Maintenant qu'on sait que le username n'existe pas, on peut récupérer le password et l'encrypter avec la salt
            const salt = bcrypt.genSaltSync(bcryptSalt);
            //Ce n'est pas obligé de rajouter "salt" car il a une valeur par défaut mais on le met car on a précisé nous-même "10" salt plus haut
            const hashPass = bcrypt.hashSync(password, salt);

            User.create({
                    username,
                    password: hashPass
                })
                .then(() => {
                    //rediriger le user à la home page
                    res.redirect('/');
                })
                .catch(error => {
                    console.log(error);
                });
        })
        .catch((error) => {
            next(error);
        });
});

//Pour pouvoir accéder aux routes que l'on met ici depuis app.js
module.exports = router;