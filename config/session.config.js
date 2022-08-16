// // ℹ️ Gets access to environment variables/settings
// // https://www.npmjs.com/package/dotenv
// require("dotenv/config");

// // ℹ️ Connects to the database
// require("./db");

// // Handles http requests (express is node js framework)
// // https://www.npmjs.com/package/express
// const express = require("express");

// const app = express();

// // ℹ️ This function is getting exported from the config folder. It runs most middlewares
// require("./config")(app);

// //set up and connect mongo
// const session = require("express-session");
// const MongoStore = require("connect-mongo");

// app.use(
//   session({
//     secret: "NotMyAge",
//     saveUninitialized: false,
//     resave: false,
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 24, //milli seconds, equal to one day
//     },
//     store: new MongoStore({
//       mongoUrl: process.env.MONGODB_URI || "mongodb://127.0.0.1/Kook-club",
//       ttl: 60 * 60 * 24,
//     }),
//   })
// );
