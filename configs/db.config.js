require('dotenv').config();
const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log(`Successfully connected to the database ${process.env.MONGODB_URI}`))
  .catch(error => {
    console.error(`An error ocurred trying to connect to the database ${process.env.MONGODB_URI}: `, error);
    process.exit(1);
  });
