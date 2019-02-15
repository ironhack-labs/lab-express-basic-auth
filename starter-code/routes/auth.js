const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const Photo = require('../models/Photo.js');
const uploadCloud = require('../config/cloudinary.js');

// registering routes
router.get('/register', (req, res, next) => {
    res.render('signup');
})
router.get('/profile', (req, res, next) => {
    if (!req.user) return res.redirect('/login');
    console.log(req.user._id, 'plesae')
    //{userId:req.user._id}
    console.log(req.user)
    Photo.find({owner:req.user._id}).then(photos =>{
        res.render('profile', {photos});
    })

  //  next();
//}, (req, res, next) => {
})
router.post('/register', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const sessionID = req.sessionID;
    User.findOne({email}, function(err, user){
        if(err) {
            next(err);
        }
        if(!!user) {
            console.log("Found user");
            return void res.render('error');
        }   

        console.log("Didn't find user");
        let newUser = new User({email, password, sessionID}); 
        newUser.save();
        res.redirect('/profile');
    })
})

// login routes
router.get('/login', (req, res, next) => {
    res.render('login');
})
router.post('/login', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email}, function(err, user){
        if(err) {
            next(err);
        }
        if(!!user) {
            console.log("Found user");
            bcrypt.compare(password, user.password, function(err, result) {
                if(!result){
                    return void res.render('error');
                }

                User.findByIdAndUpdate(user.id, {sessionID: req.sessionID}, (err, saveResult) => {
                    if (!saveResult) { 
                        throw new Error('session update error'); 
                    }
    
                    res.redirect('/profile');
                });

            });
        }
    })
})

router.get('/profile/add-photo', (req, res, next)=> {
    res.render('add-photo');
});

router.post('/profile/add-photo', uploadCloud.single('photo'), (req, res, next) => {
    const { title, description } = req.body;
    const imgPath = req.file.url;
    const imgName = req.file.originalname;
    const owner = req.user._id;
    const newPhoto = new Photo({title, description, imgPath, imgName, owner})
    newPhoto.save()
    .then(photo => {
      res.redirect('/profile');
    })
    .catch(error => {
      console.log(error);
    })
});


module.exports = router;