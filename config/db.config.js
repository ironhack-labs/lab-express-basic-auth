const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/basic-auth-cars'; //no entiendo este basisc-auth imagino que tengo que cambiarlo por index

mongoose.connect(MONGODB_URI, { 
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.info(`Successfully SERGIO connected to the database ${MONGODB_URI}`))
  .catch(error => console.error(`An error ocurred trying to connect to the database ${MONGODB_URI}`));

  //