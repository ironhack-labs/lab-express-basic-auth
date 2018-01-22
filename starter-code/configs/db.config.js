const mongoose = require('mongoose');
const DB_NAME = 'basic-auth';
const MONGO_URI = `mongodb://localhost/${DB_NAME}`;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URI, { useMongoClient: true })
    .then(() => {
        console.log(`Connected to ${DB_NAME} database.`);
    }).catch((error) => {
        console.error(`Database connection error: ${error}`);
    });