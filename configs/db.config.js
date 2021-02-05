const mongoose = require('mongoose');
const process = require('process');

mongoose
  .connect('mongodb://localhost/express-basic-auth-dev', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));

process.on('SIGINT', () => {
  mongoose.connection.close()
    .then(() => console.log('Successfully disconnected from the DB'))
    .catch(err => console.log('Error disconecting from the DB', err))
    .finally(() => process.exit());
})