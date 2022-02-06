require('dotenv/config');

const express = require('express');
const logger = require('morgan');
const hbs = require('hbs')

const app = express();

require('./config/db.config');
app.use(logger('dev'));

app.set('views', `${__dirname}/views`);
app.set('view engine', 'hbs');
app.use(express.static(`${__dirname}/public`));
hbs.registerPartials(__dirname + "/views/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { sessionConfig, loadUser } = require('./config/session.config');
app.use(sessionConfig);
app.use(loadUser);


const routes = require('./config/routes.config');
app.use('/', routes);


app.use((req, res, next) => res.status(404).render('errors/not-found'));

app.use((err, req, res, next) => {
  console.error('ERROR', req.method, req.path, err);
  if (!res.headersSent) {
    res.status(500).render('errors/internal');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Ready! Listening on port ${port}`));

