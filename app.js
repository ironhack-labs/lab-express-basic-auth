// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");
const express = require("express");
const bodyParser = require("body-parser"); // Include body-parser
const session = require("express-session");
const app = express();
require("./db");

// Set up view engine
app.set("view engine", "hbs");

// ℹ️ Connects to the database
app.use(
  session({
    secret: "your-secret-key",
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false, // Change to true if using HTTPS
      maxAge: 3600000, // 1 hour in milliseconds
    },
  })
);

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

// default value for title local
const projectName = "lab-express-basic-auth";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

const index = require("./routes/index");

app.use("/", index);

module.exports = app;
