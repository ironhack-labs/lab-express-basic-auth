require('dotenv/config');
require('./db');

const express = require('express');
const app = express();

require('./config')(app);

const projectName = 'lab-express-basic-auth';
app.locals.title = `${projectName} - Lab about Auth`;

// Routes handling
const index = require('./routes/index');
const authRouter = require('./routes/auth.routes');

app.use('/', index);
app.use('/auth', authRouter);

require('./error-handling')(app);

module.exports = app;
