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
require('./config')(app);

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

const authRouter = require('./routes/auth.routes'); 
app.use('/', authRouter);
// ...

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

const bcrypt = require("bcrypt");
const saltRounds = 10;

const plainPassword1 = "HelloWorld";
const plainPassword2 = "helloworld";

const salt = bcrypt.genSaltSync(saltRounds);

console.log(`Salt => ${salt}`);

const hash1 = bcrypt.hashSync(plainPassword1, salt);
const hash2 = bcrypt.hashSync(plainPassword2, salt);

const verifyPass1 = bcrypt.compareSync(plainPassword1, hash1);
const verifyPass2 = bcrypt.compareSync("some wrong password", hash2);

console.log(`Hash 1: ${hash1}`);
console.log(`Hash 2: ${hash2}`);
console.log("----------------------------------------");
console.log(
  `Is plainPassword1 corresponding to the created hash1: ${verifyPass1}`
);
console.log(
  `Is plainPassword2 corresponding to the created hash2: ${verifyPass2}`
);


module.exports = app;

