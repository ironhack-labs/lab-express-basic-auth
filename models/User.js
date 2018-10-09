const
  mongoose = require(`mongoose`),
  Schema = mongoose.Schema,

  userSchema = new Schema({
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: {
      createdAt: `created_at`,
      updatedAt: `updated_at`
    }
  })
;

module.exports = mongoose.model(`User`, userSchema);