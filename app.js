require('dotenv/config');

require('./db');

const express = require('express');

const hbs = require('hbs');

const app = express();

require('./config')(app);
require("./config/sessions")(app)

app.locals.appTitle = `Página de autenticación`;

const index = require('./routes/index');
app.use('/', index);

const registro = require('./routes/auth.routes');
app.use('/', registro);

const perfil = require('./routes/user.routes');
app.use('/', perfil);

require('./error-handling')(app);

module.exports = app;

