const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const authpp = new Schema({
  username : {type: String, unique: true, required:true},
  password: {type: String , required:true}
});

const authMongoose = mongoose.model("Auths", authpp);

module.exports = authMongoose;