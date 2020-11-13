const mongoose = require('mongoose');
const chalk    = require('chalk')
mongoose
  .connect('mongodb://localhost/express-basic-auth-dev', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(x => console.log(chalk.blue.inverse.bold`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error(chalk.blue.inverse.bold`Error connecting to mongo`, err));
