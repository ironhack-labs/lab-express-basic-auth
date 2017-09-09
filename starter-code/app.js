
const app = require('express')();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const globals = require('./config/globals');

// Mongoose configuration
mongoose.connect(globals.dbUrl);

// Express configuration
require('./config/express')(app);

// title default - locals
app.use((req, res, next) => {
  res.locals.title = 'lab-express-basic-auth';
  next();
});

// Routes
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
app.use('/', indexRouter);
app.use('/', authRouter);

require('./config/error-handler')(app);

module.exports = app;
