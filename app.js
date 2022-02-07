require('dotenv/config');

require('./db');

const express = require('express');
const hbs = require('hbs');
const app = express();

require('./config')(app);
require('./config/session.config')(app);


const projectName = 'lab-express-basic-auth';

app.locals.appTitle = 'LAB | Basic Auth';

const index = require('./routes/index');
app.use('/', index);

const authRouter = require("./routes/auth.routes");
app.use("/", authRouter);

const usersRouter = require("./routes/user.routes");
app.use("/", usersRouter);

require('./error-handling')(app);

module.exports = app;