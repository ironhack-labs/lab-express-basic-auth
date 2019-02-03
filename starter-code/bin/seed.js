const mongoose = require('mongoose')
mongoose
      .connect('mongodb://localhost/test', {userNewUrlParser: true})
      .then (()=> {
        console.log('Connected to Mongo Database ')
      })
      .catch(err =>{
        console.error('Error connecting to Mongo Database', err)
      })

const movies = [
  {
    user : "user",
    password: "123",
  }
];

  const Schema = require('../models/User')
  
  Schema.insertMany(movies)
    .then(()=> console.log('DataBase imported'))
    .catch(()=> console.log('Failed on importation'))