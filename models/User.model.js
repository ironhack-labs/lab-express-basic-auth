// 1.IMPORTACIONES 
const mongoose = require("mongoose")

//2. SCHEMA
const userSchema = mongoose.Schema( {
    username: {
        type: String,
        trim: true, //No puedes guardar en base se datos si mandas un dato con espacios en blancos
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match:[/^\S+@\S+\.\S+$/, "Por favor utiliza un email válido."]
    },
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true //Guardar fecha y hora en que se creo un dicumento
   }
)

// 3. MODEL 
const User = mongoose.model("User", userSchema)

// 4. EXPORTACIÓN
module.exports = User