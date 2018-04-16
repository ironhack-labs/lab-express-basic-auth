const moongose = require("mongoose");
const Schema = moongose.Schema;

const userSchema = new Schema ({

    username: String,
    password: String

},{
    timestamps: {createdAt:"created_at", updatedAt:"updated_at"}
});

const User = moongose.model ("User",userSchema);

module.exports = User;