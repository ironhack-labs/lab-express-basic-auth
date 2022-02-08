require("dotenv/config");

require("./db");

const express = require("express");
const app = express();

require("./config")(app);
require("./config/session-config")(app);

app.locals.appTitle = `lab AuthApp`;

const indexRouter = require("./routes/index");
app.use("/", indexRouter);

const authRouter = require("./routes/auth-routes");
app.use("/", authRouter);

const usersRouter = require("./routes/user-routes");
app.use("/", usersRouter);

require("./error-handling")(app);

module.exports = app;
