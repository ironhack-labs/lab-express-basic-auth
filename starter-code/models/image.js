
const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const imageSchema = new Schema({
  title: String,
  description: String,
  imgName: String,
  imgPath: String,
}, {
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" }
});

var Image = mongoose.model("Image", imageSchema);
module.exports = Image;