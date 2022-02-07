require('dotenv/config');

require('./db');

const express = require('express');
const hbs = require('hbs');                 // no es necesario. Se usa solo cuando se utilizan los Partials.
const app = express();

require('./config')(app);
require('./config/session.config')(app);

app.locals.appTitle = `Encriptionary_`;

// 👇 Start handling routes here
const indexRouter = require('./routes/index.routes');
app.use('/', indexRouter);

// Route authorization
const authRouter = require('./routes/auth.routes');
app.use('/', authRouter);

// Route main
const mainRouter = require('./routes/main.routes');
app.use('/', mainRouter)

// Route Private
const privateRouter = require('./routes/private.routes');
app.use('/', privateRouter )

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

