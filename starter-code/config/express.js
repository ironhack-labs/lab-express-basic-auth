const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const layouts = require('express-ejs-layouts');

module.exports = (app) => {
  // Middlewares configuration
  app.use(logger("dev"));

  // View engine configuration /setup
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");
  app.set('layouts', 'layout/main-layout'); //---< ????
  app.use(express.static(path.join(__dirname, "public")));
  app.use(layouts);

  // Access POST params with body parser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: false
  }));

  // Authentication
  app.use(cookieParser());
}
