const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/basic-auth", () => {
  console.log("Connected to DB");
});
