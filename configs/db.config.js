const mongoose = require('mongoose');

mongoose
  .connect('mongodb+srv://alison-paulino:Campinas03@cluster0.rvgoa.mongodb.net/AuthDB?retryWrites=true&w=majority', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));
