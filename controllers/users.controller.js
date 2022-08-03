const mongoose = require('mongoose');
const User = require('../models/User.model');

module.exports.profile = (req, res, next) => {
    const { _id } = req.params

    User.findById(_id)
    .then(user => {
        res.render('users/profile', { user })
    })
    .catch((err) => {
      console.log(err)
    })    
}