require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const app = express();

// require database configuration
const connectDb = require('./configs/db.config');
const connectSession = require('./configs/session.config');

connectDb();
connectSession(app);

// Middleware Setup
app.set('views', `${__dirname}/views`);
app.set('view engine', 'hbs');
const index = require('./routes/index.routes');
const signUp = require('./routes/signUp.routes');
const login = require("./routes/login.routes");
const main = require("./routes/main.routes");
const private = require("./routes/private.routes");
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/signup", signUp);
app.use("/login", login);
app.use("/main", main);
app.use("/private", private);


app.listen(process.env.PORT, () => console.log("server running on port 4000"));

module.exports = app;
