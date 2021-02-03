const mongoose = require('mongoose')
const process = require("process")

mongoose
  .connect('mongodb://localhost/express-basic-auth-dev', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err))


process.on('SIGNIT', () => {
  mongoose.connection
    .close()
    .then(() => console.log('Byeee from DB'))
    .catch((e) => console.log(e))
    .finally(() => process.exit())
})
