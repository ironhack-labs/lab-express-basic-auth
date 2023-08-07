require('dotenv/config');

require('./db');

const express = require('express');

const app = express();

require('./config')(app);
require("./config/session.config")(app)


app.locals.title = `Auth Test Site®`

const index = require('./routes/index');
app.use('/', index);


const authRoute = require('./routes/auth.routes');
app.use('/auth', authRoute);

const userRoute = require('./routes/user.routes');
app.use('/', userRoute);

require('./error-handling')(app);

module.exports = app;

