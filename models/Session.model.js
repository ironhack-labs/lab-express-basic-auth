const { Schema, model } = require("mongoose");

const sessionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    createdAt: {
      type: Date,
      default: Date.now(),
      index: { expires: 1000 * 60 * 60 * 24 * 7 },
    },
  },

  {
    timestamps: true,
  }
);

const Session = model("Session", sessionSchema);

module.exports = Session;
