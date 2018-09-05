var express = require('express');
var mongo_con = require('../lib/mongo-connect.js');

var mongo = mongo_con.Mongo({
  host:'10.10.20.75',
  db:'test'
});

var app = express();


app.configure(function() {
  app.use(express.favicon());
  app.use(express.bodyParser());
});

app.get('/query/:collection', mongo.query);
app.post('/query/:collection', mongo.insert);
app.post('/mapreduce/:collection', mongo.mapreduce);
app.put('/query/:collection/:id', mongo.update);
app.del('/query/:collection/:id', mongo.delete);

app.listen(9011);
console.log('Server is opened');
