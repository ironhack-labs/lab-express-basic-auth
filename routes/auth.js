const router = require("express").Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

router.get("/signup", (req, res, next) =>{
    res.render("signup");
});

router.post("/signup", (req, res, next) =>{
    console.log(req.body);
    const {username, password } = req.body;
    if (password.length < 4){
        res.render("signup", {message:'Your Password has to be 4 chars min' });
        return;
    }
    //check if username is empty
    if (username.length == 0){
        res.render("signup", {message:'Your username cannot be empty' });
        return;
    }
    // validation passed - username and password are in the correct format
	// we now check if that username already exists
    User.findOne({username: username})
        .then(userFromDB=> {
            if (userFromDB !== null){
                res.render("signup", {message:'This username is already taken' });
                return;
            } else {
                const salt = bcrypt.genSaltSync();
                const hash = bcrypt.hashSync(password, salt);
                console.log (hash);
                User.create({username: username, password: hash})
                    .then(createdUser => {
                        console.log(createdUser);
                        res.redirect('/login');


                    })
                    .catch(err=>{
                        next(err);
                    })
            }
        })

});

router.get("/login", (req, res, next) =>{
    res.render("login");
});

//Mine
router.post('/login', (req, res, next) =>{
    const{username, password} = req.body;
    User.findOne({username: username})
        .then(userFromDB => {
            if (userFromDB === null) {
                res.render('login', {message: 'incorrect credentials'})
                console.log('CHECK');
                return;
            }
            if (bcrypt.compareSync(password, userFromDB.password)){
                req.session.user = userFromDB;
                res.redirect('/profile');
            } else {
                res.render('login', {message: 'incorrect credentials'})
            }
        })
});


router.get('/logout', (req, res, next) =>{
    req.session.destroy(err =>{
        if (err){
            next(err);
        } else{
            res.redirect('/');
        }
    })
});



router.post('/string', (req, res, next)=>{
    const {username, password} = req.body

    if (password.length<4){
        res.render(('signup'), {message: 'Your password needs to be 4 chars min'});
        return;
    }
})
module.exports = router;