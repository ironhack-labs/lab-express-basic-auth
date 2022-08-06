/**
 * Module dependencies.
 * @private
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// configure dotenv
dotenv.config();

const connectDB = async (dbURI) => {
  try {
    await mongoose.connect(dbURI);
    mongoose.connection.on('connected', () => {
      console.log(`Database Connection Established at ${dbURI}`);
    });

    mongoose.connection.on('error', (error) => {
      console.warn('Warning', error);
    });

    mongoose.connection.on('disconnected', function () {
      console.log('Mongoose default connection disconnected');
    });

    // close mongoose connection if the Node process ends
    process.on('SIGINT', function () {
      mongoose.connection.close(function () {
        console.log(
          'Mongoose default connection disconnected through app termination'
        );
        process.exit(0);
      });
    });
  } catch (err) {
    console.error(err.message);
    // exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
