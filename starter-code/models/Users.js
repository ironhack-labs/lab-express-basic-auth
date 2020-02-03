const {Schema, models, model} = require("mongoose")

const userSchema = new Schema (
    {
        userName: {
          type: String,
          index: true,
          unique: true
        },
        name: String,
        email: String,
        password: String
    }, 
    {
        timestamps: true,
        versionkey: false
    }
)

const userModel = model("User", userSchema)

userModel.init().then(() => { console.log('model init') })

module.exports = userModel;

