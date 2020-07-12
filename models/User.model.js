// User model here
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
const salt = 10

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "User name is required"],
        validate: {
            isAsync: true,
            validator: function(value, isValid) {
                const self = this;
                return self.constructor.findOne({username: value})
                .exec(function(err, user){
                    if(err) {
                        throw err;
                    }
                    else if(user) {
                        if(self.id === user.id) {
                            return isValid(true);
                        }
                        return isValid(false)
                    }
                    else {
                        return isValid(true);
                    }
                })
            },
            message: 'The name exist in database'
        },
    },
    password :{
        type: String,
        required: [true, "password is required"],
        minlength: [4,"min four characters, please"]
    
        }, 
    }, 
    { timestamps: true }
    );

userSchema.pre('save', function(next) {
    if (this.isModified('password')){
    bcrypt.hash(this.password, salt)
        .then (hash => {
            this.password = hash
            next()
        })
        .catch(error => next(error))
    } else {
        next()
    }
});

userSchema.methods.checkPassword = function(password) {
    return bcrypt.compare(password, this.password);
  }

const User = mongoose.model('user', userSchema)

module.exports = User