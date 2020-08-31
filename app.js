

require('dotenv').config();

// ----------Global Requires-----------

const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
const express = require('express');
// const favicon = require('serve-favicon');
// const hbs = require('hbs');
const mongoose = require('mongoose');
// const logger = require('morgan');
const path = require('path');

// const app_name = require('./package.json').name;
// const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("connected 💾")
  })
  .catch(err => console.error('Error connecting to mongo', err));



// ----------Middleware Setup-----------
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(cookieParser());

// ---------Express View engine setup-----------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// require database configuration
// require('./configs/db.config');
// require session
require("./configs/session")(app)


// default value for title local
app.locals.title = 'Express Basic Auth Lab';

// ---------------ROUTES--------------

const index = require("./routes/index");
app.use("/", index);
app.use("/", require("./routes"))


module.exports = app;
