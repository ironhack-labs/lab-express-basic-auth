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


// const session = require('express-session');
// const MongoStore = require('connect-mongo')




// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// 👇 Start handling routes here


const session = require('express-session');
const MongoStore = require('connect-mongo');


// app.use((req, res, nex) => {
//     req.hahaha = 'asdf';
//     console.log('bye');
//     nex();
// })


app.use(
    session({
      secret: 'cat',
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: 'lax',
        secure: false,
        httpOnly: true,
        maxAge: 600000 // 60 * 1000 ms === 1 min
      },
      store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/lab-express-basic-auth'
 
        // ttl => time to live
        // ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
      })
    })
  );

  const index = require('./routes/index');
app.use('/', index);

  

// app.listen(3000, () => console.log('app is running on 3000'))

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

