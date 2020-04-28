  
const express = require('express');
const indexRouter = express.Router();

// GET  /
indexRouter.get('/', (req, res)=> {
  res.render('index', { title: 'Express basic auth'})
})


module.exports = indexRouter;