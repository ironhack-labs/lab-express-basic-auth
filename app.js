// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("./config")(app);
const session = require("express-session")
app.use(
    session({
        resave : true,
        saveUninitialized:true,
        secret: process.env.SESSION_SECRET,
        cookie: {
            sameSite : true, //frontend e backend são no mesmo lugar (localhost)
            httpOnly : true, //we are not using https
            maxAge : 3600000, //session time - se quiser que a session nunca expires é só retirar o maxAge
        },
        rolling: true
    })
)

function getCurrentLoggedUser (req, res, next) {
    if (req.session && req.session.currentUser){ //currentUser tem tudo que tem no model, podemos chamar outras coisas
        app.locals.loggedInUser = req.session.currentUser.username
        app.locals.loggedId = req.session.currentUser._id
    } else{
        app.locals.loggedInUser = ""
    }
    next()
}

app.use(getCurrentLoggedUser)

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

const auth = require("./routes/auth")
app.use("/", auth)








// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes

require('./error-handling')(app);
module.exports = app;

