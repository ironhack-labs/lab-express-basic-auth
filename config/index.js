const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const favicon = require("serve-favicon");
const path = require("path");


// "connect-mongo" together with "express-session" helps us save the session in the DB
const session = require("express-session");
const MongoSessionStore = require("connect-mongo")


module.exports = (app) => {
  app.use(logger("dev"));

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/lab-express-basic-auth";

  app.use(session(
    {
      secret: process.env.SESSION_SECRET,
       // 1 day = 24h * 60 min * 60 sec * 1000 milliseconds
      cookie: {maxAge: 24 * 60 * 60 * 1000},    
      // 2 params: ttl (time to leave, in seconds) and MongoUrl 
      store: MongoSessionStore.create({ ttl: 24 * 60 * 60, mongoUrl: MONGO_URI}),
      resave: false,
      // makes sure that if I have an unfinshed session with the user or anything goes wrong, is still saved
      saveUninitialized: true
    }
  ))

  app.set("views", path.join(__dirname, "..", "views"));
  app.set("view engine", "hbs");
  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use(favicon(path.join(__dirname, "..", "public", "images", "favicon.ico")));
};
