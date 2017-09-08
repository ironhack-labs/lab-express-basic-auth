const express = require('express');
const SignUp = require('../models/signup')
// require the Drone model here

const router = express.Router();


router.get('/', (req, res, next) => {
  SignUp.find({}, (err, drones) => {
    if (err) {
      next(err);
    } else {
      res.render('signup')
    }
  })
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
