const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const ObjectId = Schema.ObjectId; 
const photoSchema = new Schema({
  title: String,
  description: String,
  imgName: String,
  imgPath: String,
  owner: ObjectId
}, {
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" }
});

var Photo = mongoose.model("Photo", photoSchema);
module.exports = Photo;