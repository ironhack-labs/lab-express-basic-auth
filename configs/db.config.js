const mongoose = require('mongoose');
require('dotenv').config();


mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/basic-auth', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(x =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch(err => console.error('Error connecting to mongo', err));

  process.on('SIGINT', () => {
    mongoose.connection.close()
      .then(() => console.log('Mongoose default connection disconnected through app termination'))
      .catch(error => console.log('Error disconnecting from the database', error))
      .finally(() => process.exit());
}) 