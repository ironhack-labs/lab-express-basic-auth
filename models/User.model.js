

// 1. IMPORTACIONES
const mongoose = require("mongoose")


// 2. SCHEMA
const userSchema = mongoose.Schema({

  username: {
    type: String,
    unique: true
  },
  password: String
},{
  timestamps: true 
});

// 3. MODEL
const User = mongoose.model("User", userSchema)

// 4. EXPORTACIÓN
module.exports = User