// User model here
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        lowercase: true
    }, 
    password: {
        type: String,
        minlength: [8, 'Pass have to be 8 chars'],
        required: [true, 'Password is required']
    },
},  {timestamps: true}
)

userSchema.pre('save', function (next) {
    const user = this

    if (user.isModified('password')) {
        bcrypt
        .genSalt(saltRounds)
        .then((salt) => {
            return bcrypt.hash(user.password, salt)
            .then(hash => {
                user.password = hash
                next()
            })
        })
        .catch((error) => next(error))
    } else {
        next()
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User
