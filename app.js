// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');
// We reuse this import in order to have access to the `body` property in requests
const express = require('express');
// ℹ️ Responsible for the messages you see in the terminal as requests are coming in
// https://www.npmjs.com/package/morgan
const logger = require("morgan");

const hbs = require('hbs');

// // ℹ️ Needed when we deal with cookies (we will when dealing with authentication)
// // https://www.npmjs.com/package/cookie-parser
// const cookieParser = require("cookie-parser");
// // ℹ️ Serves a custom favicon on each request
// // https://www.npmjs.com/package/serve-favicon
// const favicon = require("serve-favicon");


const app = express();

require('./config/db.config');
app.use(logger('dev'));


// Normalizes the path to the views folder
app.set('views', `${__dirname}/views`);

// Sets the view engine to handlebars
app.set('view engine', 'hbs');

 // Handles access to the public folder
app.use(express.static(`${__dirname}/public`));

 // Handles access to the partials
hbs.registerPartials(__dirname + "/views/partials");

// To have access to `body` property in the request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

// 👇 Start handling routes here
const routes = require('./config/routes.config');
app.use('/', routes);


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes

app.use((req, res, next) => res.status(404).render("errors/not-found"));
    // this middleware runs whenever requested page is not available
   
app.use((err, req, res, next) => {
  // whenever you call next(err), this middleware will handle the error
  // always logs the error
  console.error("ERROR", req.method, req.path, err);

    // only render if the error ocurred before sending the response
    if (!res.headersSent) {
      res.status(500).render("errors/internal");
    }
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Ready! Listening on port ${port}`));

