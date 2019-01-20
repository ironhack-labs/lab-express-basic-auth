const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/starter-code';

mongoose.connect(MONGODB_URI, {useNewUrlParser: true})
.then(() => {console.log(`Connected to Mongo! Database name: "${MONGODB_URI}"`)})
.catch(error => {console.error(`Error connecting to mongo ${MONGODB_URI}`)});