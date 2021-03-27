const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/express-basic-auth-dev", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) => x.connection.dropDatabase())
  .catch((err) => console.error("Error connecting to mongo", err));
