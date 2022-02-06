require('dotenv/config');
const express = require('express');
const logger = require("morgan");
const hbs = require('hbs');

// config folder
require('./config/db.config');
const routes = require('./config/routes.config');

const app = express();

// views folder
app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));
hbs.registerPartials(__dirname + "/views/partials");

app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', routes);

// error handling folder
require('./error-handling')(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {  console.log(`Server listening on port http://localhost:${PORT}`);});

