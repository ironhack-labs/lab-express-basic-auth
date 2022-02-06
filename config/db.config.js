const mongoose = require("mongoose");
const MONGO_URI   = process.env.MONGODB_URI || "mongodb://localhost/lab-express-basic-auth";

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((error) => {
    console.error(`An error ocurred trying to connect to de database ${x.connections[0].name}`, error);
    process.exit(0);  
  });

  process.on('SIGINT', function () {
    mongoose.connection.close(function () {
      console.log('Mongoose disconnected on app termination');
      process.exit(0);
    });
  });


