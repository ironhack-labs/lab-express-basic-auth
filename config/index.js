
const express = require("express");

const logger = require("morgan");

const favicon = require("serve-favicon");

const path = require("path");

const hbs = require ("hbs")

module.exports = (app) => {
  // In development environment the app logs
  app.use(logger("dev"));
}
// Middleware configuration
  module.exports = (app) => {
  app.use(logger("dev"));

  // To have access to `body` property in the request
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.set("views", path.join(__dirname, "..", "views"));

  app.set("view engine", "hbs");

  app.use(express.static(path.join(__dirname, "..", "public")));


  app.use(favicon(path.join(__dirname, "..", "public", "images", "favicon.ico")));
};
