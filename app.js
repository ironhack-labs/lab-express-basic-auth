// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("./config")(app);

// default value for title local
const projectName = "lab-express-basic-auth";
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

//session configuration, session is also a middleware(globally)
const session = require("express-session")
    // https://www.npmjs.com/package/connect-mongo
const MongoStore = require("connect-mongo")

app.use(
        session({
            secret: process.env.SESSION_SECRET, //to sign the cookie
            cookie: { maxAge: 1000 * 60 * 60 * 24 },
            resave: true,
            store: MongoStore.create({
                mongoUrl: process.env.MONGODB_URI
            })
        })
    )
    //end of session configuration


// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

// Iteration 1 | Sign Up
const auth = require("./routes/auth");
app.use("/", auth);

const application = require("./routes/application");
app.use("/", application);


// ❗ To handle errors. Routes that don"t exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;