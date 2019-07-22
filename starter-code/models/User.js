const mongoose = require("mongoose");
const { Schema } = mongoose;

const schemaUser = new Schema(
	{
		username: {
       type: String,
       required: true, 
       },
		password: { 
      type: String, 
      required: true }
	},
	{
		versionKey: false,
		timestamps: true
	}
);

module.exports = mongoose.model("User", schemaUser);
