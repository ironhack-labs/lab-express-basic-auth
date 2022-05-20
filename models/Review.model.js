const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  comment: { type: String, required: true, maxlength: 280 },
});

const Review = model("Review", reviewSchema);

module.exports = Review;
