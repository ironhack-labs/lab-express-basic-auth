'use strict';

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/database-name', {
  keepAlive: true,
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE
});
