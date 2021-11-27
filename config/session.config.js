// config/session.config.js
 
// require session
const session = require('express-session');

// require mongostore - manage sessions
const MongoStore = require('connect-mongo');

// store process.env keys
const { SESS_SECRET, NODE_ENV, MONGODB_URI } = process.env;

const isProduction = NODE_ENV === 'production';

//require mongoose
//const mongoose = require('mongoose');
 
// since we are going to USE this middleware in the app.js,
// let's export it and have it receive a parameter
function sessionInit (app) {
    app.set('trust proxy', 1);
    app.use(
      session({
        // secres is the 'password' for session to read your hased cookie
        secret: SESS_SECRET,
        // store the session in MONGODB
        // resave this session, resave it
        // re resave the cookie any time there is a change in it
        resave: true,
        // save cookie when login
        //dont save the cookie till there is someghing attatched to it
        saveUninitialized: false,
        cookie: {
          // restrictions based upon where is coming from
          // our client and server is the same
          // config the policies for cookies coming or not form the same site as the server
          // config the policies for cookies coming or not from the same site as the server
          sameSite: isProduction ? 'none' : 'lax',
          // only allow cookies from https when running un production environment
          // we are testing our app in localhost --> http, not secure
          // but we put environment production
          secure: isProduction,
          // means that the client, not access the cookie --> document.cookie
          // this is a secure cookie and we can't access through document.cookie
          httpOnly: true,
          maxAge: 600000 // the cookie is going to last in miliseconds
        }, // ADDED code below !!!
        // In production we need to store the session somewhere--> in mongoose
        store: MongoStore.create({
          mongoUrl: MONGODB_URI,
          // ttl => time to live, how long the cooke should be saved
           ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
        })
      })
    );
  };

  module.exports = { sessionInit };


  // module.exports = app => {
  //   app.set('trust proxy', 1);
   
  //   app.use(
  //     session({
  //       // secres is the 'password' for session to read your hased cookie
  //       secret: process.env.SESS_SECRET,
  //       // store the session in MONGODB
  //       // resave this session, resave it
  //       // re resave the cookie any time there is a change in it
  //       resave: true,
  //       // save cookie when login
  //       //dont save the cookie till there is someghing attatched to it
  //       saveUninitialized: false,
  //       cookie: {
  //         // restrictions based upon where is coming from
  //         // our client and server is the same
  //         // config the policies for cookies coming or not form the same site as the server
  //         sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  //         // only https request 
  //         // it's production environment, our server is 
  //         // we are testing our app in localhost --> http, not secure
  //         // but we put environment production
  //         secure: process.env.NODE_ENV === 'production',
  //         // means that the client, not access the cookie --> document.cookie
  //         // this is a secure cookie and we can't access through document.cookie
  //         httpOnly: true,
  //         maxAge: 6000000 // the cookie is going to last in miliseconds
  //       }, // ADDED code below !!!
  //       // In production we need to store the session somewhere--> in mongoose
  //       store: MongoStore.create({
  //         mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost/basic-auth'
          
  //         // ttl => time to live
  //         // ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
  //       })
  //     })
  //   );
  // };