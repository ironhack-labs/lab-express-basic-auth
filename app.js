
require('dotenv/config');


require('./db');

const express = require('express');



const hbs = require('hbs');

const app = express();


require('./config')(app);
require('./config/session.config.js')(app)



const index = require('./routes/index');
app.use('/', index);
const authRoutes = require('./routes/auth.routes')
app.use('/', authRoutes)
const privateRoutes = require('./routes/private.routes')
app.use('/spirit-animal', privateRoutes)

require('./error-handling')(app);

module.exports = app;

