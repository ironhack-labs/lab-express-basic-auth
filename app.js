require('dotenv').config();

//configs
require("./configs/db.config");
const routes = require("./routes/routes");

//npm extensions
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const logger       = require('morgan');
const path         = require('path');

const session = require('./configs/session.config');
const User = require("./models/User.model");

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(session);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + "/views/partials");
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Authentication - Mongoose';


app.use((req, res, next) => {
  if (req.session.currentUserId) {
    User.findById(req.session.currentUserId)
      .then(user => {
        if (user) {
          req.currentUser = user
          res.locals.currentUser = user

          next()
        }
      })
  } else {
    next()
  }
})

app.use("/", routes);


module.exports = app;
