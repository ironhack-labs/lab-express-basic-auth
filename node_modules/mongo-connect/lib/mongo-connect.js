var mongodb = require('mongodb');
var log4js = require('log4js');
var BSON = require('mongodb').pure().BSON;
var generic_pool = require('generic-pool');

var default_log = {
  appenders: [
    {
      type:"console"
    },
  ],
  replaceConsole:true
};

exports.Mongo = function(config) {
  var max=config.max || 4;
  var db=config.db || 'test'; 
  var host=config.host || 'localhost'; 
  var port=config.port || 27017; 

  log4js.configure(config.log || default_log);
  var logger = log4js.getLogger();

  var pool = generic_pool.Pool({
    name: 'mongo-rest-db',
    max: max,
    create: function(callback) {
      new mongodb.Db(db,
        new mongodb.Server(host,port),
        {safe:true,auto_reconnect:true}
      ).open(function(err,db) {
        if(err) {
          logger.error('Cannot open database:'+err);
        }
        callback(err,db);
      });
    },
    destroy: function(db) {
      db.close();
    }
  });
  
  this.query = function(req, res) {
    var query = req.query.query ? JSON.parse(req.query.query):{};
    pool.acquire(function(err, db) {
      db.collection(req.params.collection, function(err,collection) {
        if(err) {
          pool.release(db);
          res.json({error:err});
        } else {
          if(req.params.id) {
            var spec = {'_id':mongodb.ObjectID.createFromHexString(req.params.id)};
            collection.findOne(spec, function(err, doc) {
              pool.release(db);
              res.json(doc);
            });
          } else {
            collection.find(query).toArray(function(err,docs) {
              pool.release(db);
              res.json(docs);
            });
          }
        }
      });
    });
  };
  
  this.insert = function(req, res) {
    pool.acquire(function(err, db) {
      db.collection(req.params.collection, function(err,collection) {
        collection.insert(req.body, function(err,docs) {
          pool.release(db);
          if(err) {
            res.json({success:false,error:err});
          } else {
            res.json({success:true,_id:docs[0]._id}); 
          }
        });
      });
    });
  };
  
  this.update = function(req, res) {
    var spec = {'_id':mongodb.ObjectID.createFromHexString(req.params.id)};
    pool.acquire(function(err, db) {
      db.collection(req.params.collection, function(err,collection) {
        collection.update(spec, req.body, function(err,result) {
          pool.release(db);
          if(err) {
            res.json({success:false,error:err});
          } else {
            res.json({success:true,result:result}); 
          }
        });
      });
    });
  };

  this.delete = function(req, res) {
    var spec = {'_id':mongodb.ObjectID.createFromHexString(req.params.id)};
    pool.acquire(function(err, db) {
      db.collection(req.params.collection, function(err,collection) {
        collection.remove(spec,function(err,result) {
          pool.release(db);
          if(err) {
            res.json({success:false,error:err});
          } else {
            res.json({success:true,result:result}); 
          }
        });
      });
    });
  };
  
  this.mapreduce = function(req, res) {
    pool.acquire(function(err, db) {
      db.collection(req.params.collection, function(err,collection) {
        if(req.body.map && req.body.reduce) {
          try {
            var map_f = eval('('+req.body.map+')');
            var reduce_f = eval('('+req.body.reduce+')');
            collection.mapReduce(map_f, reduce_f, {out:{inline:1}}, function(err, docs) {
              pool.release(db);
              if(err) {
                res.json({'success':false,'message':err.toString()});
              } else {
                res.json({'success':true,'result':docs});
              }
            });
          } catch(err) {
             pool.release(db);
             res.json({'success':false,'message':err.toString()});
          }
        } else {
          pool.release(db);
          res.json({'message':'require map & reduce functions'});
        }
      });
    });
  };

  return this;
};


