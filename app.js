require('dotenv/config');
require('./db');
const express = require('express');
const hbs = require('hbs');

const app = express();
require('./config')(app);

require('./config/session.config')(app)

const projectName = 'lab-express-basic-auth';


const index = require('./routes/index');
app.use('/', index);

app.use('/', require('./routes/auth.routes'))

app.use('/', require('./routes/user.routes'))



require('./error-handling')(app);

module.exports = app;

