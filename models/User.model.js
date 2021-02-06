// User model here

const mongoose = require ('mongoose')

const bcrypt = require('bcrypt')
const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
const SALT_ROUNDS = 10

const userSchema = new mongoose.Schema({

    userName : {
        type:String,
        required:"User name is required",
        unique:"User name have to be unique",
        trim:true,
        match:[EMAIL_PATTERN, 'Type a valid email']
    },
    password : {
        type:String,
        required:"Password is required",
        match:[PASSWORD_PATTERN, 'the password required al least: 1 number, 1 uppercase, 1 lowercase y 8 characters']

    }

});
// funcion del esquema que se ejecuta antes de aplicar la peticion que se hizo al modelo(insertar, borrar, actualizar)
// parametro 1  es el evento.parametro 2 función que ejecuta, devuelve next que es la funcion para que continue la ejecucion
userSchema.pre('save',function(next){
     // los datos de entrada que se reciben en el metodo de mongoose  utilizado para acceder al modelo estan en this porque utilizamos una function

    if (this.isModified('password')){
        bcrypt.hash(this.password,SALT_ROUNDS)
        .then (hashdedPassword =>{
            this.password =hashdedPassword;
            next()

        })
    } else {
        next();

    }
 
});

const User = mongoose.model('User',userSchema);

module.exports= User;


