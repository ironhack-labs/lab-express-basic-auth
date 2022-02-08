require("dotenv/config");

require("./db");

const express = require("express");

const hbs = require("hbs");

const app = express();

require("./config")(app);
require("./config/session.config")(app);
// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("./config")(app);

app.locals.appName = `Register App`;

// 👇 Start handling routes here
const index = require("./routes/index.routes");
app.use("/", index);

//register
const registerRouter = require("./routes/auth.routes");
app.use("/", registerRouter);

//user
const userRouter = require("./routes/user.routes");
app.use("/", userRouter);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
