const mongoose = require ('mongoose')
const bcrypt = require ('bcrypt')

const EMAIL_PATTERN =
/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const PASSWORD_PATTERN = /^.{8,}$/i;
const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minLength: [3, "Name must have 3 characteres minimun"],
    },
    email: {
        type : String,
        required: [true, "Email adrees is necesary"],
        unique: true,
        match: [EMAIL_PATTERN, "Email adress not valid, please try again"],
    },
    password: {
        type: String,
        required: [true, "Password is necesary"],
        match : [PASSWORD_PATTERN, "Password must have 8 characters minimun"],
    },
    image: {
        type: String,
        default: "https://res.cloudinary.com/plasoironhack/image/upload/v1644663323/ironhack/multer-example/icono-de-li%CC%81nea-perfil-usuario-si%CC%81mbolo-empleado-avatar-web-y-disen%CC%83o-ilustracio%CC%81n-signo-aislado-en-fondo-blanco-192379539_jvh06m.jpg"
    }
})

userSchema.pre('save', function (next){
    const user = this

    if(user.isModified("password")){
        bcrypt
        .hash(user.password, SALT_ROUNDS)
        .then((hash) => {
            user.password = hash
            next()
        }).catch((err) => next(err))
    } else {
        next()
    }
})
userSchema.methods.checkPassword = function (password) {
    const user = this
    return bcrypt.compare(password, user.password)
}

const User = mongoose.model("User", userSchema)

module.exports = User