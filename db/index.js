const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/lab-express-basic-auth";

mongoose
  .connect(MONGO_URI)
  .then((mongoConnection) => {
    console.log(`Connected to Mongo! Database name: "${mongoConnection.connections[0].name}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
