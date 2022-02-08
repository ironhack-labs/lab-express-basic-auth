
//Importaciones


const mongoose = require("mongoose")




//funciones
const connectDB = async () => {

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true})
         console.log('base de datos conectada')   
    }
    
    catch (error) {

        console.log(error)
        return process.exit(1)
    }

}

//exportacion

module.exports = connectDB
