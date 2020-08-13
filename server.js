var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var config= require('/config');
var userRoute = require('/routes/user.route');

var config = require()
var port = 3000;
var app = express();

app.use(bodyParser.json());
app.use('/users', userRoute);


var app = express();

//set public resources folder
app.use(express.static(__dirname + '/public'));

// set route
app.get('/',(req,res) =>{
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

var server = http.createServer(app);
server.listen(port,()=>{
    console.log('Server is starting - ' + port);
});