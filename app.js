require('dotenv/config');
require('./db');

const express = require('express');
const app = express();

require('./config')(app);


// const projectName = 'Lab user';
// const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();
require('./config/session.config')(app)   // session setup

app.locals.appTitle = `Lab user`;


const index = require('./routes/index.routes');
app.use('/', index);


const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes);


require('./error-handling')(app);

module.exports = app;

