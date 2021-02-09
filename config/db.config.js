//Nos conectamos a la DB y cerramos la conecxion cuando se cierre el proceso en consola

//Requerimos mogoose y su proceso
const mongoose = require('mongoose');
const process = require('process');

//===========================Conexion======================================================

//MONGO_URI inyectamos variable de entorno y el te devuele una URL
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost/3000')
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));

  process.on('SIGINT', () => {
    mongoose.connection.close()
      .then(() => console.log ('Succesfully disconnected from DB'))
      .catch(() => console.error('Error Disconecting from DB', e))
      .finally(() => process.exit())
  })
