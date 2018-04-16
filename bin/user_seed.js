require("dotenv").config();

const mongoose = require('mongoose');
const Celebrity = require('../models/User');
//const data = require('./user_data');

const dbURL = process.env.DBURL;

mongoose.connect(dbURL)
.then(() =>{
    console.log(`Connected to db ${dbURL}`);
    User.collection.drop();

    User.create(data)
    .then(function (users) {
        console.log(users)
    })
})
.catch((err) => {
    console.log(err)
});