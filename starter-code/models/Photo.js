const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const photoSchema = new mongoose.Schema({
  srcImg: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

const Photo = new mongoose.model("Photo", photoSchema);

module.exports = Photo;