const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/node-basic-auth";

mongoose
  .connect(MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));

  module.exports = mongoose;