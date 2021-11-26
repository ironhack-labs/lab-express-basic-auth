
require('dotenv/config');

require('./db');

const express = require('express');
const app = express();
const hbs = require('hbs');
require('./config')(app);

const sessionManager = require("./config/session")

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

//MIDDLEWARES
console.log(sessionManager)
sessionManager(app)

app.use(express.static("public"))


//LAYOUT MIDDLEWARE
app.use((req, res, next)=>{
    res.locals.currentUser = req.session.currentUser
    next()
})


// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

app.use("/auth", require("./routes/auth"))
app.use("/users", require("./routes/users"))








// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

