// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
const mongoose = require('mongoose');

// ℹ️ Sets the MongoDB URI for our app to have access to it.
// If no env has been set, we dynamically set it to whatever the folder name was upon the creation of the app

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lab-express-basic-auth';

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => console.info(`Successfully connected to the database ${MONGODB_URI}`))
  .catch((error) => {
    console.error(`An error ocurred trying to connect to de database ${MONGODB_URI}`, error);
    process.exit(0);
  });

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});
