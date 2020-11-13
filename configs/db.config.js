const chalk = require('chalk');
const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/express-basic-auth-dev', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(x => console.log(chalk.greenBright.inverse.bold(`Connected to Mongo! Database name: "${x.connections[0].name}"`)))
  .catch(err => console.error(chalk.red.inverse.bold('Error connecting to mongo'), err));
