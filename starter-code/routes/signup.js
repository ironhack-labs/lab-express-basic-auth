const express = require('express');
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const SignUp = require('../models/signup')

// require the Drone model here

const router = express.Router();


router.get('/', (req, res, next) => {
  SignUp.find({}, (err, signup) => {
    if (err) {
      next(err);
    } else {
      res.render('signup')
    }
  })
});

// router.post("/", (req, res, next) => {
//   let newUserInfo = {
//     username: req.body.username,
//     password: req.body.password,
//     hashPass: bcrypt.hashSync(password),
//   }
//   const newUser  = new SignUp(newUserInfo);
//     newUser = SignUp ({
//       username,
//       password: hashPass
//     }),
//
//     newUser.save((err)=> {
//       if (err) {next(err);}
//       else{
//         res.redirect('/');
//       }
//     })
//   });


  router.post("/", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser  = SignUp({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      res.redirect("/");
    });
  });

//
// router.get('/drones/new', (req, res, next) => {
//   res.render('drones/new')
// });
//
//
// router.post('/drones', (req, res, next) => {
//   const newDroneInfo = {
//     droneName: req.body.droneName,
//     propellers: req.body.propellers,
//     maxSpeed: req.body.maxSpeed
//   }
//   const newDrone = new Drone(newDroneInfo);
//
//   newDrone.save((err) => {
//     if (err) {
//       next(err);
//     } else {
//       return res.redirect('../drones')
//     }
//   });
// });

module.exports = router;
