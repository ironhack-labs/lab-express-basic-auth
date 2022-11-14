
require('dotenv/config');


require('./db');


const express = require('express');


const hbs = require('hbs');

const app = express();


require('./config')(app);
require('./config/session.config')(app)


app.locals.title = 'ironAuth';


const index = require('./routes/index');
app.use('/', index);

const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes)
//EXPORTACION DE LA HOJA DE RUTAS Y USO DE LA MISMA

const userRoutes = require("./routes/user.routes");
app.use("/", userRoutes)
//EXPORTACION DE LA HOJA DE RUTAS DE USER

require('./error-handling')(app);

module.exports = app;

