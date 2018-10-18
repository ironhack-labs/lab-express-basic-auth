// Packages
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Definition of the Schema
const userSchema = new Schema({
  username: {
    type: String
  },
  password: {
    type: String
  },
  
});

// Definition of the Model
const User = mongoose.model("User", userSchema);

// Export the model 
module.exports = User;