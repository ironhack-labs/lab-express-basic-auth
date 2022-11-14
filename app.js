require("dotenv/config");
require("./db");

const express = require("express");
const app = express();

const { isLoggedIn } = require("./middleware/loggedin-middleware");

require("./config")(app);

app.locals.title = `_ironAuth`;
app.locals.isLoggedIn = false;

require("./config/session.config")(app);

/* const layoutLoaded = (req, res, next) => {
	req.app.locals.name = req.session.user ? true : false;
	next();
}; */
/* app.use(layoutLoaded); */

const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes);

const profileRoutes = require("./routes/profile.routes");
app.use("/", isLoggedIn, profileRoutes);

require("./error-handling")(app);

module.exports = app;
