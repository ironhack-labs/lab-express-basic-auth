
require("dotenv/config");

require("./db");

const express = require("express");

const hbs = require("hbs");

const app = express();

require("./config")(app);
require('./config/session.config')(app);

const projectName = "basic-auth";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with IronLauncher`;

const index = require("./routes/index");
app.use("/", index);
const authRouter = require('./routes/auth.routes'); 
app.use('/', authRouter);

require("./error-handling")(app);
module.exports = app;
