const mongoose = require('mongoose');

mongoose
    .connect('mongodb://localhost:27017/express-basic-auth-dev', {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
    .catch(err => console.error('Error connecting to mongo', err));

process.on('SIGINT', () => {
    mongoose.connections
        .close()
        .then(() => console.log('Succesfully disconnected from the DB'))
        .catch((e) => console.error('Error disconnecting from the DB', e))
        .finally(() => process.exit())

})